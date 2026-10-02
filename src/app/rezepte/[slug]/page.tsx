import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import ViewTracker from "@/components/ViewTracker";
import { formatMinutes } from "@/lib/utils";

export const revalidate = 3600;
export const dynamicParams = true;

const BASE_URL = "https://goldene-rezepte.com";

export async function generateStaticParams() {
  const recipes = await prisma.recipe.findMany({ where: { published: true }, select: { slug: true } });
  return recipes.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

// Strips list markers ("•", "-", "👉") and tabs carried over from pasted recipes.
function cleanLine(line: string): string {
  return line.replace(/^[\s•\-*·▪👉]+/u, "").replace(/\t/g, " ").trim();
}

// Ingredient lines like "Für den Teig" or "Zum Servieren:" are group headings, not ingredients.
function isGroupHeading(line: string): boolean {
  return !/^\d/.test(line) && (/:$/.test(line) || /^(Für|Zum|Zur|Außerdem)\b/.test(line) || /^Optional$/i.test(line) || /^\(.*\)$/.test(line)) && line.length < 60;
}

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try { return JSON.parse(value) as T; } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { slug, published: true } });
  if (!recipe) return { title: "Rezept nicht gefunden – GoldeneRezepte" };
  const url = `${BASE_URL}/rezepte/${slug}`;
  return {
    title: `${recipe.title} – GoldeneRezepte`,
    description: recipe.description,
    alternates: { canonical: url },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      url,
      images: recipe.imageUrl ? [{ url: recipe.imageUrl }] : [],
      type: "article",
    },
  };
}

export default async function RezeptDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { slug, published: true } });
  if (!recipe) notFound();

  const ingredients: string[] = JSON.parse(recipe.ingredients).map(cleanLine).filter(Boolean);
  const steps: string[] = JSON.parse(recipe.steps).map(cleanLine).filter(Boolean);
  const tips: string[] = parseJson<string[]>(recipe.tips) ?? [];
  const faq: { q: string; a: string }[] = parseJson<{ q: string; a: string }[]>(recipe.faq) ?? [];

  const similarRecipes = await prisma.recipe.findMany({
    where: { published: true, category: recipe.category, slug: { not: slug } },
    orderBy: { views: "desc" },
    take: 3,
    select: { slug: true, title: true, description: true, category: true, prepTime: true, cookTime: true, imageUrl: true },
  });

  const recipeUrl = `${BASE_URL}/rezepte/${slug}`;
  const stepImage = recipe.imageUrl ? [{ "@type": "ImageObject", url: recipe.imageUrl }] : undefined;
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    url: recipeUrl,
    description: recipe.description,
    image: recipe.imageUrl ? [recipe.imageUrl] : undefined,
    recipeCategory: recipe.category,
    recipeCuisine: "Deutsche Küche",
    keywords: `${recipe.category}, Rezept, Deutsche Küche, Hausmannskost, GoldeneRezepte`,
    recipeIngredient: ingredients.filter((ing) => !isGroupHeading(ing)),
    recipeInstructions: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.split(" ").slice(0, 6).join(" ").replace(/[,.]$/, "") || `Schritt ${i + 1}`,
      text: s,
      url: `${recipeUrl}#schritt-${i + 1}`,
      ...(stepImage ? { image: stepImage } : {}),
    })),
    // Times and yield are often unset (0); omit them rather than claiming "0 Minuten".
    ...(recipe.prepTime > 0 ? { prepTime: `PT${recipe.prepTime}M` } : {}),
    ...(recipe.cookTime > 0 ? { cookTime: `PT${recipe.cookTime}M` } : {}),
    ...(recipe.prepTime + recipe.cookTime > 0 ? { totalTime: `PT${recipe.prepTime + recipe.cookTime}M` } : {}),
    ...(recipe.servings > 0 ? { recipeYield: `${recipe.servings} Portionen` } : {}),
    author: { "@type": "Person", name: "Seyhan", url: `${BASE_URL}/ueber-uns` },
    publisher: { "@type": "Organization", name: "GoldeneRezepte", url: BASE_URL },
    datePublished: recipe.createdAt.toISOString().split("T")[0],
    dateModified: recipe.updatedAt.toISOString().split("T")[0],
  };

  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <ViewTracker slug={slug} />
      <div className="recipe-detail-hero">
        {recipe.imageUrl ? (
          <Image src={recipe.imageUrl} alt={recipe.title} fill priority sizes="100vw" style={{ objectFit: "contain", objectPosition: "center center" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "5rem" }} aria-label="Kein Bild verfügbar">🍽️</div>
        )}
      </div>

      <div className="recipe-detail-body">
        <div className="recipe-card-category" style={{ marginBottom: "0.5rem" }}>{recipe.category}</div>
        <h1 style={{ marginBottom: "0.75rem" }}>{recipe.title}</h1>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
          Von <Link href="/ueber-uns" style={{ color: "var(--gold)" }}>Seyhan</Link>
        </p>
        <p className="recipe-description">{recipe.description}</p>

        {(recipe.prepTime > 0 || recipe.cookTime > 0 || recipe.servings > 0 || recipe.difficulty) && (
          <div className="recipe-meta" style={{ marginBottom: "1.5rem" }}>
            {recipe.prepTime > 0 && <span>🔪 Vorbereitung: {formatMinutes(recipe.prepTime)}</span>}
            {recipe.cookTime > 0 && <span>⏱ Garzeit: {formatMinutes(recipe.cookTime)}</span>}
            {recipe.servings > 0 && <span>🍽 {recipe.servings} Portionen</span>}
            {recipe.difficulty && <span>📊 {recipe.difficulty}</span>}
          </div>
        )}

        <h2 className="recipe-section-title">Zutaten</h2>
        <ul className="ingredients-list">
          {ingredients.map((ing, i) =>
            isGroupHeading(ing) ? (
              <li key={i} style={{ listStyle: "none", fontWeight: 700, marginTop: i > 0 ? "1rem" : 0 }}>
                {ing.replace(/:$/, "")}
              </li>
            ) : (
              <li key={i}>{ing}</li>
            )
          )}
        </ul>

        <h2 className="recipe-section-title">Zubereitung</h2>
        <ul className="steps-list">
          {steps.map((step, i) => (
            <li key={i} id={`schritt-${i + 1}`}>
              <span>{step}</span>
            </li>
          ))}
        </ul>

        {tips.length > 0 && (
          <>
            <h2 className="recipe-section-title">Tipps & Variationen</h2>
            <ul className="ingredients-list">
              {tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </>
        )}

        {faq.length > 0 && (
          <>
            <h2 className="recipe-section-title">Häufige Fragen</h2>
            {faq.map((item, i) => (
              <div key={i} style={{ marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", marginBottom: "0.4rem" }}>{item.q}</h3>
                <p className="recipe-description" style={{ margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </>
        )}

        <Link href="/rezepte" className="btn btn-outline" style={{ marginTop: "1rem" }}>
          ← Zurück zur Übersicht
        </Link>
      </div>

      {similarRecipes.length > 0 && (
        <div style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "3rem 0" }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>Ähnliche Rezepte</h2>
            <p className="section-subtitle">Weitere {recipe.category}-Rezepte, die dir gefallen könnten</p>
            <div className="recipes-grid">
              {similarRecipes.map((r) => (
                <Link href={`/rezepte/${r.slug}`} key={r.slug}>
                  <div className="recipe-card">
                    <div className="recipe-card-img">
                      {r.imageUrl ? (
                        <Image src={r.imageUrl} alt={r.title} fill sizes="400px" style={{ objectFit: "cover" }} />
                      ) : (
                        <span>🍽️</span>
                      )}
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
          </div>
        </div>
      )}

      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">GoldeneRezepte</div>
            <p className="footer-desc">Schnell, einfach und lecker – Rezepte für jeden Tag.</p>
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
        <div className="footer-bottom">© {new Date().getFullYear()} GoldeneRezepte</div>
      </footer>
    </>
  );
}
