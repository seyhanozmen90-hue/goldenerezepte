// Runde 3: Vorbereitung, Garzeit, Portionen und Schwierigkeit für alle Rezepte.
// Kullanım: node --env-file=.env scripts/content-fixes-2026-10/apply-round3.js
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

  const meta = JSON.parse(fs.readFileSync(path.join(dir, "meta-round3.json"), "utf8"));
  delete meta._format;
  for (const [id, [prepTime, cookTime, servings, difficulty]] of Object.entries(meta)) {
    await prisma.recipe.update({ where: { id: Number(id) }, data: { prepTime, cookTime, servings, difficulty } });
  }
  console.log(`Süre/porsiyon/zorluk yazıldı: ${Object.keys(meta).length} tarif`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
