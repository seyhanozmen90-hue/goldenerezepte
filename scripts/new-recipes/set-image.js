// Mevcut bir tarifin görselini değiştirir (eski dosya depoda kalır), önce yedek alır.
// Kullanım: node --env-file=.env scripts/new-recipes/set-image.js <id> <görsel-yolu>
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");
const { PrismaClient } = require("@prisma/client");
const { revalidate } = require("./revalidate");

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const [id, image] = [Number(process.argv[2]), process.argv[3]];
  if (!id || !image) throw new Error("Kullanım: set-image.js <id> <görsel-yolu>");

  const recipe = await prisma.recipe.findUniqueOrThrow({ where: { id } });
  fs.writeFileSync(path.join(__dirname, `backup-${Date.now()}.json`), JSON.stringify([recipe], null, 1));
  console.log(`Yedek alındı. Eski görsel: ${recipe.imageUrl}`);

  const buffer = await sharp(image)
    .flatten({ background: "#ffffff" })
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  const fileName = `${Date.now()}-${id}.jpg`;
  const { error } = await supabase.storage
    .from("recipe-images")
    .upload(fileName, buffer, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("recipe-images").getPublicUrl(fileName);
  await prisma.recipe.update({ where: { id }, data: { imageUrl: data.publicUrl } });
  await revalidate([`/rezepte/${recipe.slug}`, "/rezepte", "/"]);
  console.log(`Görsel güncellendi (${Math.round(buffer.length / 1024)} KB): #${id} → ${data.publicUrl}`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
