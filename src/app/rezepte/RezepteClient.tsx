"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const CATEGORIES = ["Alle", "Hauptgerichte", "Vorspeisen", "Desserts", "Suppen", "Salate", "Backen"];
const PER_PAGE = 12;

type Recipe = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  cookTime: number;
  imageUrl: string | null;
};

function RezepteContent({ recipes }: { recipes: Recipe[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const activeCategory = searchParams.get("kategorie") || "Alle";

  useEffect(() => { setPage(1); }, [search, activeCategory]);

  const filtered = recipes.filter((r) => {
    const matchCat = activeCategory === "Alle" || r.category === activeCategory;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="container section">
      <h1 className="section-title">Alle Rezepte</h1>
      <p className="section-subtitle">{recipes.length} Rezepte in unserer Sammlung</p>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Rezept suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-filter">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`cat-btn ${activeCategory === c ? "active" : ""}`}
            onClick={() =>
              router.push(c === "Alle" ? "/rezepte" : `/rezepte?kategorie=${encodeURIComponent(c)}`)
            }
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>Keine Rezepte gefunden</h3>
          <p>Versuche eine andere Suche oder Kategorie.</p>
        </div>
      ) : (
        <>
          <div className="recipes-grid">
            {paginated.map((r) => (
              <Link href={`/rezepte/${r.slug}`} key={r.id}>
                <div className="recipe-card">
                  <div className="recipe-card-img">
                    {r.imageUrl ? (
                      <Image
                        src={r.imageUrl}
                        alt={r.title}
                        fill
                        unoptimized
                        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        loading="lazy"
                      />
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

          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                ← Zurück
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`pagination-btn${p === page ? " active" : ""}`} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              <button className="pagination-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
                Weiter →
              </button>
            </div>
          )}

          <p style={{ textAlign: "center", marginTop: "1rem", fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", color: "var(--muted)" }}>
            Seite {page} von {totalPages} · {filtered.length} Rezepte
          </p>
        </>
      )}

      <footer style={{ marginTop: "4rem" }}>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">GoldeneRezepte</div>
            <p className="footer-desc">Authentische deutsche Rezepte für jeden Tag.</p>
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
              <li><Link href="/impressum">Impressum</Link></li>
              <li><Link href="/datenschutz">Datenschutz</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} GoldeneRezepte</div>
      </footer>
    </div>
  );
}

export default function RezepteClient({ recipes }: { recipes: Recipe[] }) {
  return (
    <Suspense>
      <RezepteContent recipes={recipes} />
    </Suspense>
  );
}
