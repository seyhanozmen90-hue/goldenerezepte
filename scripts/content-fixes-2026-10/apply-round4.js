// Runde 4: "Wissenswertes" (Herkunft, Verbreitung, Technik) für alle Rezepte.
// Kullanım: node --env-file=.env scripts/content-fixes-2026-10/apply-round4.js
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const dir = __dirname;

async function main() {
  const all = await prisma.recipe.findMany({ orderBy: { id: "asc" } });
  const backup = path.join(dir, `backup-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(all, null, 1));
  console.log(`Yedek alındı: ${backup} (${all.length} tarif)`);

  const stories = JSON.parse(fs.readFileSync(path.join(dir, "stories.json"), "utf8"));
  for (const [id, story] of Object.entries(stories)) {
    await prisma.recipe.update({ where: { id: Number(id) }, data: { story } });
  }
  console.log(`Wissenswertes yazıldı: ${Object.keys(stories).length} tarif`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
