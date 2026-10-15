// Mevcut tarifi günceller (slug ve görsel aynı kalır), önce yedek alır.
// Kullanım: node --env-file=.env scripts/new-recipes/update.js scripts/new-recipes/<dosya>.json
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const jsonFields = ["ingredients", "steps", "tips", "faq"];

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("JSON dosyası belirtilmedi");
  const { id, recipe } = JSON.parse(fs.readFileSync(file, "utf8"));

  const all = await prisma.recipe.findMany({ orderBy: { id: "asc" } });
  const backup = path.join(__dirname, `backup-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(all, null, 1));
  console.log(`Yedek alındı: ${backup} (${all.length} tarif)`);

  const data = { ...recipe };
  for (const f of jsonFields) if (data[f]) data[f] = JSON.stringify(data[f]);
  const updated = await prisma.recipe.update({ where: { id }, data });
  console.log(`Tarif güncellendi: #${updated.id} /rezepte/${updated.slug}`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
