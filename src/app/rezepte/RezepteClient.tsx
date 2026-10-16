"use client";
import { useState } from "react";
import RecipeCard, { type RecipeCardData } from "@/components/RecipeCard";

// Die Liste selbst wird auf dem Server gerendert (crawlbare Links); die Suche
// filtert nur clientseitig und ersetzt die Liste, solange etwas eingegeben ist.
export default function RezepteSearch({
  recipes,
  children,
}: {
  recipes: RecipeCardData[];
  children: React.ReactNode;
}) {
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const results = q
    ? recipes.filter(
        (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      )
    : [];

  return (
    <>
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Rezept suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!q ? (
        children
      ) : results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>Keine Rezepte gefunden</h3>
          <p>Versuche eine andere Suche oder Kategorie.</p>
        </div>
      ) : (
        <>
          <div className="recipes-grid">
            {results.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "1rem", fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", color: "var(--muted)" }}>
            {results.length} Rezepte gefunden
          </p>
        </>
      )}
    </>
  );
}
