// AdSense "Düşük değere sahip içerik" düzeltmeleri.
// Önce `npm run db:push` çalıştırılmalı (tips/faq sütunları).
// Kullanım: node --env-file=.env scripts/content-fixes-2026-10/apply.js
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

  const changes = JSON.parse(fs.readFileSync(path.join(dir, "changes.json"), "utf8"));
  for (const ch of changes) await prisma.recipe.update({ where: { id: ch.id }, data: ch.data });
  console.log(`İçerik düzeltmeleri uygulandı: ${changes.length} tarif`);

  const tips = JSON.parse(fs.readFileSync(path.join(dir, "tips.json"), "utf8"));
  for (const [id, t] of Object.entries(tips)) {
    await prisma.recipe.update({
      where: { id: Number(id) },
      data: { tips: JSON.stringify(t.tips), faq: JSON.stringify(t.faq) },
    });
  }
  console.log(`Tipps & SSS eklendi: ${Object.keys(tips).length} tarif`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
