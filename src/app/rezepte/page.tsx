import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";
import RecipeCard from "@/components/RecipeCard";
import CookieSettingsLink from "@/components/CookieSettingsLink";
import RezepteSearch from "./RezepteClient";

const CATEGORIES = ["Hauptgerichte", "Vorspeisen", "Desserts", "Suppen", "Salate", "Backen"];
const PER_PAGE = 12;
const BASE = "https://goldene-rezepte.com";

type SearchParams = Promise<{ kategorie?: string; seite?: string }>;

function parse(params: { kategorie?: string; seite?: string }) {
  const category = CATEGORIES.includes(params.kategorie ?? "") ? params.kategorie! : null;
  const page = Math.max(1, Number.parseInt(params.seite ?? "1", 10) || 1);
  return { category, page };
}

// Liste mit Kategorie und Seite als echte URLs, damit Suchmaschinen alle Rezepte über Links finden.
function href(category: string | null, page = 1) {
  const qs = new URLSearchParams();
  if (category) qs.set("kategorie", category);
  if (page > 1) qs.set("seite", String(page));
  const s = qs.toString();
  return s ? `/rezepte?${s}` : "/rezepte";
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category, page } = parse(await searchParams);
  const name = category ? `${category}-Rezepte` : "Alle Rezepte";
  const suffix = page > 1 ? ` – Seite ${page}` : "";
  return {
    title: `${name}${suffix} – GoldeneRezepte`,
    description: category
      ? `${category}: alle Rezepte aus meiner Sammlung – mit genauen Mengen, Zeiten und Tipps.`
      : "Durchsuche meine Sammlung an schnellen, einfachen und leckeren Rezepten.",
    alternates: { canonical: `${BASE}${href(category, page)}` },
  };
}

export default async function RezeptePage({ searchParams }: { searchParams: SearchParams }) {
  const { category, page } = parse(await searchParams);

  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, slug: true, title: true, description: true,
      category: true, prepTime: true, cookTime: true, imageUrl: true,
    },
  });

  const filtered = category ? recipes.filter((r) => r.category === category) : recipes;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if (page > totalPages) notFound();
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <NavBar />
      <div className="container section">
        <h1 className="section-title">{category ? `${category}-Rezepte` : "Alle Rezepte"}</h1>
        <p className="section-subtitle">
          {category ? `${filtered.length} Rezepte in dieser Kategorie` : `${recipes.length} Rezepte in meiner Sammlung`}
        </p>

        <RezepteSearch recipes={recipes}>
          <div className="category-filter">
            {[null, ...CATEGORIES].map((c) => (
              <Link key={c ?? "Alle"} href={href(c)} className={`cat-btn ${category === c ? "active" : ""}`}>
                {c ?? "Alle"}
              </Link>
            ))}
          </div>

          <div className="recipes-grid">
            {paginated.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Seiten">
              {page > 1 ? (
                <Link className="pagination-btn" href={href(category, page - 1)} rel="prev">← Zurück</Link>
              ) : (
                <span className="pagination-btn disabled">← Zurück</span>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={href(category, p)}
                  className={`pagination-btn${p === page ? " active" : ""}`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages ? (
                <Link className="pagination-btn" href={href(category, page + 1)} rel="next">Weiter →</Link>
              ) : (
                <span className="pagination-btn disabled">Weiter →</span>
              )}
            </nav>
          )}

          <p style={{ textAlign: "center", marginTop: "1rem", fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", color: "var(--muted)" }}>
            Seite {page} von {totalPages} · {filtered.length} Rezepte
          </p>
        </RezepteSearch>

        <footer style={{ marginTop: "4rem" }}>
          <div className="footer-grid">
            <div>
              <div className="footer-logo">GoldeneRezepte</div>
              <p className="footer-desc">Goldene Rezepte für jeden Tag.</p>
            </div>
            <div>
              <div className="footer-title">Kategorien</div>
              <ul className="footer-links">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <Link href={href(c)}>{c}</Link>
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
                <li><CookieSettingsLink /></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">© {new Date().getFullYear()} GoldeneRezepte</div>
        </footer>
      </div>
    </>
  );
}
