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

  const recipeUrl = `${BASE_URL}/rezepte/${slug}`;
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: recipe.imageUrl ? [recipe.imageUrl] : undefined,
    recipeCategory: recipe.category,
    keywords: recipe.category,
    recipeIngredient: ingredients,
    recipeInstructions: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.split(" ").slice(0, 5).join(" "),
      text: s,
      url: `${recipeUrl}#schritt-${i + 1}`,
    })),
    prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
    cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
    totalTime: (recipe.prepTime || recipe.cookTime) ? `PT${(recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)}M` : undefined,
    recipeYield: `${recipe.servings} Portionen`,
    author: { "@type": "Organization", name: "GoldeneRezepte" },
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
