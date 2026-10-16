// Büyük PNG tarif görsellerini ~250 KB JPG'ye çevirir; eski dosyalar depoda kalır.
// Kullanım: node --env-file=.env scripts/new-recipes/convert-images.js [--ids=1,2,3] [--concurrency=4]
// Geri alma: images-map-*.json içindeki oldUrl değerleri imageUrl'e geri yazılır.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];

async function convert(recipe) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(recipe.imageUrl);
      if (!res.ok) throw new Error(`İndirme hatası ${res.status}`);
      const input = Buffer.from(await res.arrayBuffer());
      const output = await sharp(input)
        .flatten({ background: "#ffffff" })
        .resize({ width: 1600, withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
      const fileName = `${Date.now()}-${recipe.id}.jpg`;
      const { error } = await supabase.storage
        .from("recipe-images")
        .upload(fileName, output, { contentType: "image/jpeg", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("recipe-images").getPublicUrl(fileName);
      await prisma.recipe.update({ where: { id: recipe.id }, data: { imageUrl: data.publicUrl } });
      return { id: recipe.id, oldUrl: recipe.imageUrl, newUrl: data.publicUrl, oldKB: Math.round(input.length / 1024), newKB: Math.round(output.length / 1024) };
    } catch (e) {
      if (attempt >= 3) throw e;
      await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
  }
}

async function main() {
  const ids = arg("ids")?.split(",").map(Number);
  const concurrency = Number(arg("concurrency") || 4);

  const all = await prisma.recipe.findMany({ orderBy: { id: "asc" } });
  fs.writeFileSync(path.join(__dirname, `backup-${Date.now()}.json`), JSON.stringify(all, null, 1));
  const todo = all.filter((r) => r.imageUrl?.endsWith(".png") && (!ids || ids.includes(r.id)));
  console.log(`Yedek alındı. Dönüştürülecek: ${todo.length} görsel`);

  const mapFile = path.join(__dirname, `images-map-${Date.now()}.json`);
  const done = [];
  const failed = [];
  let next = 0;
  async function worker() {
    while (next < todo.length) {
      const recipe = todo[next++];
      try {
        const r = await convert(recipe);
        done.push(r);
        fs.writeFileSync(mapFile, JSON.stringify(done, null, 1));
        console.log(`#${r.id}: ${r.oldKB} KB → ${r.newKB} KB (${done.length}/${todo.length})`);
      } catch (e) {
        failed.push(recipe.id);
        console.error(`#${recipe.id} HATA: ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));

  const before = done.reduce((s, r) => s + r.oldKB, 0);
  const after = done.reduce((s, r) => s + r.newKB, 0);
  console.log(`Bitti: ${done.length} başarılı, ${failed.length} hatalı ${failed.length ? `(${failed.join(",")})` : ""}`);
  console.log(`Toplam: ${Math.round(before / 1024)} MB → ${Math.round(after / 1024)} MB. Eşleme: ${mapFile}`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
