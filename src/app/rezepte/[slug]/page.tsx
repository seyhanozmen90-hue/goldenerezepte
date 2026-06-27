import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import ViewTracker from "@/components/ViewTracker";

export const revalidate = 3600;
export const dynamicParams = true;

const BASE_URL = "https://goldene-rezepte.com";

export async function generateStaticParams() {
  const recipes = await prisma.recipe.findMany({ where: { published: true }, select: { slug: true } });
  return recipes.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

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

  const ingredients: string[] = JSON.parse(recipe.ingredients);
  const steps: string[] = JSON.parse(recipe.steps);

  const similarRecipes = await prisma.recipe.findMany({
    where: { published: true, category: recipe.category, slug: { not: slug } },
    orderBy: { views: "desc" },
    take: 3,
    select: { slug: true, title: true, description: true, category: true, cookTime: true, imageUrl: true },
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
    recipeIngredient: ingredients,
    recipeInstructions: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.split(" ").slice(0, 6).join(" ").replace(/[,.]$/, "") || `Schritt ${i + 1}`,
      text: s,
      url: `${recipeUrl}#schritt-${i + 1}`,
      ...(stepImage ? { image: stepImage } : {}),
    })),
    prepTime: `PT${recipe.prepTime ?? 0}M`,
    cookTime: `PT${recipe.cookTime ?? 0}M`,
    totalTime: `PT${(recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)}M`,
    recipeYield: `${recipe.servings} Portionen`,
    author: { "@type": "Organization", name: "GoldeneRezepte", url: BASE_URL },
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
          <Image src={recipe.imageUrl} alt={recipe.title} fill priority unoptimized sizes="100vw" style={{ objectFit: "contain", objectPosition: "center center" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "5rem" }} aria-label="Kein Bild verfügbar">🍽️</div>
        )}
      </div>

      <div className="recipe-detail-body">
        <div className="recipe-card-category" style={{ marginBottom: "0.5rem" }}>{recipe.category}</div>
        <h1 style={{ marginBottom: "1.5rem" }}>{recipe.title}</h1>
        <p className="recipe-description">{recipe.description}</p>

        <h2 className="recipe-section-title">Zutaten</h2>
        <ul className="ingredients-list">
          {ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>

        <h2 className="recipe-section-title">Zubereitung</h2>
        <ul className="steps-list">
          {steps.map((step, i) => (
            <li key={i} id={`schritt-${i + 1}`}>
              <span>{step}</span>
            </li>
          ))}
        </ul>

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
                        <Image src={r.imageUrl} alt={r.title} fill unoptimized sizes="400px" style={{ objectFit: "cover" }} />
                      ) : (
                        <span>🍽️</span>
                      )}
                    </div>
                    <div className="recipe-card-body">
                      <div className="recipe-card-category">{r.category}</div>
                      <div className="recipe-card-title">{r.title}</div>
                      <div className="recipe-card-desc">{r.description}</div>
                      {r.cookTime > 0 && (
                        <div className="recipe-meta">
                          <span>⏱ {r.cookTime} Min.</span>
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
