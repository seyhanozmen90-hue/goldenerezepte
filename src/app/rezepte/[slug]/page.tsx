import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = await prisma.recipe.findUnique({
    where: { slug: params.slug, published: true },
  });
  if (!recipe) return { title: "Rezept nicht gefunden – GoldeneRezepte" };
  return {
    title: `${recipe.title} – GoldeneRezepte`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: recipe.imageUrl ? [{ url: recipe.imageUrl }] : [],
      type: "article",
    },
  };
}

export default async function RezeptDetailPage({ params }: Props) {
  const recipe = await prisma.recipe.findUnique({ where: { slug: params.slug, published: true } });
  if (!recipe) notFound();

  const ingredients: string[] = JSON.parse(recipe.ingredients);
  const steps: string[] = JSON.parse(recipe.steps);

  return (
    <>
      <NavBar />

      <div className="recipe-detail-hero">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "5rem" }}>🍽️</div>
        )}
        <div className="recipe-detail-hero-overlay">
          <div className="recipe-detail-hero-text">
            <div className="recipe-card-category">{recipe.category}</div>
            <h1>{recipe.title}</h1>
          </div>
        </div>
      </div>

      <div className="recipe-detail-body">
        <div className="recipe-detail-meta">
          <div className="recipe-detail-meta-item">
            <div className="meta-label">Pişirme Süresi</div>
            <div className="meta-value">{recipe.cookTime} Min.</div>
          </div>
        </div>

        <p className="recipe-description">{recipe.description}</p>

        <h2 className="recipe-section-title">Zutaten</h2>
        <ul className="ingredients-list">
          {ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>

        <h2 className="recipe-section-title">Zubereitung</h2>
        <ol className="steps-list">
          {steps.map((step, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <Link href="/rezepte" className="btn btn-outline" style={{ marginTop: "1rem" }}>
          ← Zurück zur Übersicht
        </Link>
      </div>

      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">GoldeneRezepte</div>
            <p className="footer-desc">Authentische deutsche Rezepte für jeden Tag.</p>
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
