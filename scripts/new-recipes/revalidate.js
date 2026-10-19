// Canlı sitede verilen sayfaların önbelleğini hemen yeniler.
// Kullanım (modül): await revalidate(["/rezepte/slug", "/rezepte", "/"])
// Kullanım (CLI):   node --env-file=.env scripts/new-recipes/revalidate.js /rezepte/slug ...
const SITE = "https://goldene-rezepte.com";

async function revalidate(paths) {
  try {
    const res = await fetch(`${SITE}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": process.env.NEXTAUTH_SECRET },
      body: JSON.stringify({ paths }),
    });
    console.log(res.ok ? `Önbellek yenilendi: ${paths.join(", ")}` : `Önbellek yenilenemedi (HTTP ${res.status})`);
  } catch (e) {
    console.log(`Önbellek yenilenemedi: ${e.message}`);
  }
}

module.exports = { revalidate };

if (require.main === module) revalidate(process.argv.slice(2));
