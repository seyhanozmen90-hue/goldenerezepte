"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import NavBar from "@/components/NavBar";

const CATEGORIES = ["Alle", "Hauptgerichte", "Vorspeisen", "Desserts", "Suppen", "Salate", "Backen"];
const PER_PAGE = 12;

type Recipe = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  imageUrl: string | null;
};

function RezepteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const activeCategory = searchParams.get("kategorie") || "Alle";

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/rezepte");
    const data = await res.json();
    setRecipes(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);
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
    <>
      <NavBar />

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

        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h3>Rezepte werden geladen...</h3>
          </div>
        ) : filtered.length === 0 ? (
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
                        <img
                          src={r.imageUrl}
                          alt={r.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        "🍽️"
                      )}
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
                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  ← Zurück
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`pagination-btn${p === page ? " active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                >
                  Weiter →
                </button>
              </div>
            )}

            <p
              style={{
                textAlign: "center",
                marginTop: "1rem",
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.82rem",
                color: "var(--muted)",
              }}
            >
              Seite {page} von {totalPages} · {filtered.length} Rezepte
            </p>
          </>
        )}
      </div>

      <footer>
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
    </>
  );
}

export default function RezeptePage() {
  return (
    <Suspense>
      <RezepteContent />
    </Suspense>
  );
}
