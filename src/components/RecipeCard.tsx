import Link from "next/link";
import Image from "next/image";
import { formatMinutes } from "@/lib/utils";

export type RecipeCardData = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  prepTime: number;
  cookTime: number;
  imageUrl: string | null;
};

export default function RecipeCard({ recipe: r }: { recipe: RecipeCardData }) {
  return (
    <Link href={`/rezepte/${r.slug}`}>
      <div className="recipe-card">
        <div className="recipe-card-img">
          {r.imageUrl ? (
            <Image
              src={r.imageUrl}
              alt={r.title}
              fill
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
          {r.prepTime + r.cookTime > 0 && (
            <div className="recipe-meta">
              <span>⏱ {formatMinutes(r.prepTime + r.cookTime)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
