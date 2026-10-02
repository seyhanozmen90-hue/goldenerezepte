// Runde 2: Tipps/SSS für die übrigen Rezepte, sachlichere Titel/Beschreibungen,
// korrigierte Backzeiten in tips.json, Tippfehler.
// Kullanım: node --env-file=.env scripts/content-fixes-2026-10/apply-round2.js
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const dir = __dirname;
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));

async function main() {
  const all = await prisma.recipe.findMany({ orderBy: { id: "asc" } });
  const backup = path.join(dir, `backup-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(all, null, 1));
  console.log(`Yedek alındı: ${backup} (${all.length} tarif)`);

  const text = read("text-round2.json");
  for (const [id, data] of Object.entries(text)) await prisma.recipe.update({ where: { id: Number(id) }, data });
  console.log(`Başlık/açıklama güncellendi: ${Object.keys(text).length} tarif`);

  const tips = { ...read("tips.json"), ...read("tips-round2.json") };
  for (const [id, t] of Object.entries(tips)) {
    await prisma.recipe.update({
      where: { id: Number(id) },
      data: { tips: JSON.stringify(t.tips), faq: JSON.stringify(t.faq) },
    });
  }
  console.log(`Tipps & SSS yazıldı: ${Object.keys(tips).length} tarif`);

  const typo = all.find((r) => r.ingredients.includes("Backpulper"));
  if (typo) {
    await prisma.recipe.update({ where: { id: typo.id }, data: { ingredients: typo.ingredients.replace("Backpulper", "Backpulver") } });
    console.log(`Yazım hatası düzeltildi: tarif ${typo.id}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
