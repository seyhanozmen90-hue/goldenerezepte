// Mevcut tarifleri derinleştirir: hikâyeye paragraf, ipuçlarına ve SSS'e ekleme yapar. Önce yedek alır.
// Kullanım: node --env-file=.env scripts/new-recipes/deepen.js scripts/new-recipes/<dosya>.json
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { revalidate } = require("./revalidate");
const prisma = new PrismaClient();

async function main() {
  const items = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  const all = await prisma.recipe.findMany({ orderBy: { id: "asc" } });
  const backup = path.join(__dirname, `backup-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(all, null, 1));
  console.log(`Yedek alındı: ${backup}`);
  const paths = ["/rezepte", "/"];
  for (const it of items) {
    const r = all.find((x) => x.id === it.id);
    if (!r) { console.log(`#${it.id} bulunamadı`); continue; }
    const tips = JSON.parse(r.tips || "[]");
    const faq = JSON.parse(r.faq || "[]");
    const data = {};
    if (it.story_add && !(r.story || "").includes(it.story_add.slice(0, 40))) data.story = `${(r.story || "").trim()}\n\n${it.story_add}`.trim();
    if (it.tips_add) data.tips = JSON.stringify([...tips, ...it.tips_add.filter((t) => !tips.includes(t))]);
    if (it.faq_add) data.faq = JSON.stringify([...faq, ...it.faq_add.filter((f) => !faq.some((x) => x.q === f.q))]);
    await prisma.recipe.update({ where: { id: it.id }, data });
    paths.push(`/rezepte/${r.slug}`);
    console.log(`#${it.id} güncellendi: ${r.title}`);
  }
  await revalidate(paths);
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
