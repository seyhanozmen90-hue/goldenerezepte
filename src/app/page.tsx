import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatMinutes } from "@/lib/utils";
import NavBar from "@/components/NavBar";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Goldene Rezepte für jeden Tag",
  description: "Schnell, einfach und zum Verlieben – Rezepte, die wirklich gelingen.",
  alternates: { canonical: "https://goldene-rezepte.com" },
  openGraph: {
    title: "Goldene Rezepte für jeden Tag",
    description: "Schnell, einfach und zum Verlieben – Rezepte, die wirklich gelingen.",
    url: "https://goldene-rezepte.com",
    siteName: "GoldeneRezepte",
    images: [
      {
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200",
        width: 1200,
        height: 630,
        alt: "Goldene Rezepte für jeden Tag",
      },
    ],
    type: "website",
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goldene Rezepte für jeden Tag",
    description: "Schnell, einfach und zum Verlieben – Rezepte, die wirklich gelingen.",
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
        <p>Schnell, einfach und zum Verlieben – Rezepte, die wirklich gelingen.</p>
        <Link href="/rezepte" className="btn btn-primary">Jetzt kochen →</Link>
      </section>

      {/* Intro */}
      <div className="container section" style={{ maxWidth: "760px", paddingTop: "3rem", paddingBottom: "3rem", textAlign: "center" }}>
        <h2 className="section-title">Hallo, ich bin Seyhan!</h2>
        <p style={{ fontFamily: "system-ui, sans-serif", color: "var(--muted)", lineHeight: 1.85, marginTop: "1.25rem", fontSize: "1rem" }}>
          Kochen habe ich bei meiner Mutter gelernt, viele deutsche Klassiker bei unseren deutschen
          Nachbarn. Hier sammle ich alltagstaugliche Rezepte – von Aufläufen und Suppen bis zu Kuchen
          und Desserts – mit genauen Mengen, Zeiten und Tipps, damit sie dir sicher gelingen.
        </p>
        <Link href="/ueber-uns" style={{ display: "inline-block", marginTop: "1rem", color: "var(--gold)", fontFamily: "system-ui, sans-serif" }}>
          Mehr über mich →
        </Link>
      </div>

      {/* Kategorien Section */}
      <div style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container section" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
          <h2 className="section-title">Kategorien</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
            {CATEGORIES.slice(1).map((c) => (
              <Link
                key={c}
                href={`/rezepte?kategorie=${encodeURIComponent(c)}`}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "1.25rem 1rem",
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

      <div className="container section">
        <h2 className="section-title">Neueste Rezepte</h2>
        <p className="section-subtitle">Frisch hinzugefügt aus meiner Sammlung</p>

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
                      <Image src={r.imageUrl} alt={r.title} fill sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                    ) : "🍽️"}
                  </div>
                  <div className="recipe-card-body">
                    <div className="recipe-card-category">{r.category}</div>
                    <div className="recipe-card-title">{r.title}</div>
                    <div className="recipe-card-desc">{r.description}</div>
                    {r.prepTime + r.cookTime > 0 && (
                      <div className="recipe-meta">
                        <span>⏱ {formatMinutes(r.prepTime + r.cookTime)}</span>
                      </div>
                    )}
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

      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">GoldeneRezepte</div>
            <p className="footer-desc">Schnell, einfach und lecker – Rezepte für jeden Tag.</p>
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
              <li><Link href="/ueber-uns">Über uns</Link></li>
              <li><Link href="/kontakt">Kontakt</Link></li>
              <li><Link href="/impressum">Impressum</Link></li>
              <li><Link href="/datenschutz">Datenschutz</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} GoldeneRezepte – Alle Rechte vorbehalten</div>
      </footer>
    </>
  );
}
