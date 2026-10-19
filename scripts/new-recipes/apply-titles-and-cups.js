// Başlıkları sadeleştirir ve "Tasse" ölçülerine gram/ml ekler. Önce yedek alır.
// Kullanım: node --env-file=.env scripts/new-recipes/apply-titles-and-cups.js scripts/new-recipes/<dosya>.json [--dry]
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { revalidate } = require("./revalidate");

const prisma = new PrismaClient();
const dry = process.argv.includes("--dry");

async function main() {
  const { titles, ingredients } = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  const all = await prisma.recipe.findMany({ orderBy: { id: "asc" } });
  const byId = new Map(all.map((r) => [r.id, r]));

  const changes = new Map();
  for (const [id, title] of Object.entries(titles)) {
    if (!byId.has(+id)) throw new Error(`#${id} yok`);
    const clash = all.find((r) => r.id !== +id && r.title === title);
    if (clash) throw new Error(`Başlık #${clash.id} ile aynı: ${title}`);
    changes.set(+id, { title });
  }
  for (const [id, map] of Object.entries(ingredients)) {
    const list = JSON.parse(byId.get(+id).ingredients);
    for (const from of Object.keys(map)) {
      if (!list.includes(from)) throw new Error(`#${id} satır bulunamadı: ${from}`);
    }
    const next = list.map((l) => map[l] ?? l);
    changes.set(+id, { ...changes.get(+id), ingredients: JSON.stringify(next) });
  }
  console.log(`Değişecek tarif: ${changes.size} (başlık ${Object.keys(titles).length}, malzeme ${Object.keys(ingredients).length})`);
  if (dry) return;

  const backup = path.join(__dirname, `backup-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(all, null, 1));
  console.log(`Yedek alındı: ${backup}`);

  for (const [id, data] of changes) await prisma.recipe.update({ where: { id }, data });
  console.log("Güncellendi.");
  await revalidate([...[...changes.keys()].map((id) => `/rezepte/${byId.get(id).slug}`), "/rezepte", "/"]);
}

main()
  .catch((e) => { console.error(e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
