// Erzeugt eine Zuordnung alter (reißerischer, langer) Slugs -> sauberer Slugs aus dem Titel.
// Schreibt nur Dateien, ändert die DB NICHT.
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
const hype = /(^dies[a-z]*-|verrueckt|suechtig|suchtfaktor|unfassbar|unglaublich|ueberrascht|wahnsinn|traum|zauber|himmlisch|genial|hammer|garantiert|sofort-weg|unwiderstehlich|ultra|besser-als|-ever|macht-alle|noch-nie|will-jeder|lieben-alle|einfach-jeden|nur-d+-minuten|in-nur|wenigen-minuten|minuten-fertig|minuten-vorbereitet)/i;
const KEEP = new Set([126, 185, 222, 249, 208, 228, 229, 226, 258, 276]);
const slugify = (s) => s.toLowerCase()
  .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
(async () => {
  const rs = await p.recipe.findMany({ orderBy: { id: "asc" } });
  const used = new Set(rs.map((r) => r.slug)); used.add("zitronen-baiser-cannoli"); used.add("zutaten");
  const map = {};
  for (const r of rs.filter((x) => x.published && !KEEP.has(x.id) && hype.test(x.slug))) {
    let base = slugify(r.title).slice(0, 70).replace(/-+$/, "");
    let cand = base, i = 2;
    while (used.has(cand) && cand !== r.slug) cand = `${base}-${i++}`;
    if (cand === r.slug) continue;
    used.add(cand);
    map[r.slug] = { id: r.id, to: cand };
  }
  fs.writeFileSync(path.join(__dirname, "2026-11-24-slug-map.json"), JSON.stringify(map, null, 1));
  const lines = Object.entries(map).map(([from, v]) => `  ${JSON.stringify(from)}: ${JSON.stringify(v.to)},`).join("\n");
  fs.writeFileSync(path.join(__dirname, "../../src/lib/slugRedirects.ts"),
`// Alte, reißerische Rezept-URLs -> saubere URLs (301). Siehe scripts/new-recipes/2026-11-24-slug-map.json
export const slugRedirects: Record<string, string> = {
${lines}
};
`);
  console.log(Object.keys(map).length, "Slugs");
  for (const [f, v] of Object.entries(map).slice(0, 8)) console.log(v.id, f, "->", v.to);
  await p.$disconnect();
})();
