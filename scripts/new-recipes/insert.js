// Yeni tarif ekleme: görseli küçültüp Supabase'e yükler, yedek alır, tarifi yayınlar.
// Kullanım: node --env-file=.env scripts/new-recipes/insert.js scripts/new-recipes/<dosya>.json
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");
const { PrismaClient } = require("@prisma/client");
const { revalidate } = require("./revalidate");

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("JSON dosyası belirtilmedi");
  const { image, recipe } = JSON.parse(fs.readFileSync(file, "utf8"));

  if (await prisma.recipe.findUnique({ where: { slug: recipe.slug } })) {
    throw new Error(`Slug zaten var: ${recipe.slug}`);
  }

  const all = await prisma.recipe.findMany({ orderBy: { id: "asc" } });
  const backup = path.join(__dirname, `backup-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(all, null, 1));
  console.log(`Yedek alındı: ${backup} (${all.length} tarif)`);

  const buffer = await sharp(image)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  const fileName = `${Date.now()}.jpg`;
  const { error } = await supabase.storage
    .from("recipe-images")
    .upload(fileName, buffer, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("recipe-images").getPublicUrl(fileName);
  console.log(`Görsel yüklendi (${Math.round(buffer.length / 1024)} KB): ${data.publicUrl}`);

  const created = await prisma.recipe.create({
    data: {
      ...recipe,
      imageUrl: data.publicUrl,
      ingredients: JSON.stringify(recipe.ingredients),
      steps: JSON.stringify(recipe.steps),
      tips: JSON.stringify(recipe.tips),
      faq: JSON.stringify(recipe.faq),
      published: true,
    },
  });
  console.log(`Tarif eklendi: #${created.id} /rezepte/${created.slug}`);
  await revalidate([`/rezepte/${created.slug}`, "/rezepte", "/"]);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
