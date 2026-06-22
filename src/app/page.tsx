import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "GoldeneRezepte – Authentische Deutsche Küche",
  description: "Traditionelle Rezepte aus deutschen Haushalten – einfach, authentisch und lecker.",
  openGraph: {
    title: "GoldeneRezepte – Authentische Deutsche Küche",
    description: "Traditionelle Rezepte aus deutschen Haushalten – einfach, authentisch und lecker.",
    images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200"],
  },
};

const CATEGORIES = ["Alle", "Hauptgerichte", "Vorspeisen", "Desserts", "Suppen", "Salate", "Backen"];

export default async function HomePage() {
  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <NavBar />

      <section className="hero">
        <h1>Goldene <em>Rezepte</em> für jeden Tag</h1>
        <p>Schnell, einfach und zum Verlieben – über 100 Rezepte, die wirklich gelingen.</p>
        <Link href="/rezepte" className="btn btn-primary">Jetzt kochen →</Link>
      </section>

      <div className="container section">
        <h2 className="section-title">Neueste Rezepte</h2>
        <p className="section-subtitle">Frisch hinzugefügt aus unserer Sammlung</p>

        {recipes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>Noch keine Rezepte vorhanden</h3>
            <p>
              <Link href="/admin" style={{ color: "var(--gold)" }}>Jetzt Rezepte hinzufügen →</Link>
            </p>
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map((r) => (
              <Link href={`/rezepte/${r.slug}`} key={r.id}>
                <div className="recipe-card">
                  <div className="recipe-card-img">
                    {r.imageUrl ? (
                      <img src={r.imageUrl} alt={r.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : "🍽️"}
                  </div>
                  <div className="recipe-card-body">
                    <div className="recipe-card-category">{r.category}</div>
                    <div className="recipe-card-title">{r.title}</div>
                    <div className="recipe-card-desc">{r.description}</div>
                    <div className="recipe-meta">
                      <span>⏱ {r.cookTime} Min.</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {recipes.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/rezepte" className="btn btn-outline">Alle Rezepte anzeigen</Link>
          </div>
        )}
      </div>

      {/* Kategorien Section */}
      <div style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container section" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
          <h2 className="section-title">Kategorien</h2>
          <p className="section-subtitle">Finde das richtige Rezept für jeden Anlass</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
            {CATEGORIES.slice(1).map((c) => (
              <Link
                key={c}
                href={`/rezepte?kategorie=${encodeURIComponent(c)}`}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "1.5rem 1rem",
                  textAlign: "center",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.9rem",
                  color: "var(--muted)",
                  transition: "all 0.2s",
                  display: "block",
                }}
                className="cat-link"
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
                  {c === "Hauptgerichte" ? "🥩" : c === "Vorspeisen" ? "🥗" : c === "Desserts" ? "🍰" : c === "Suppen" ? "🍲" : c === "Salate" ? "🥬" : "🥐"}
                </div>
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">GoldeneRezepte</div>
            <p className="footer-desc">Authentische deutsche Rezepte für jeden Tag. Von der Oma bis zur modernen Küche.</p>
          </div>
          <div>
            <div className="footer-title">Kategorien</div>
            <ul className="footer-links">
              {CATEGORIES.slice(1).map((c) => (
                <li key={c}>
                  <Link href={`/rezepte?kategorie=${encodeURIComponent(c)}`}>{c}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-title">Info</div>
            <ul className="footer-links">
              <li><Link href="/impressum">Impressum</Link></li>
              <li><Link href="/datenschutz">Datenschutz</Link></li>
              <li><Link href="/ueber-uns">Über uns</Link></li>
              <li><Link href="/datenschutz">Datenschutz</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} GoldeneRezepte – Alle Rechte vorbehalten</div>
      </footer>
    </>
  );
}
