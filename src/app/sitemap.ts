import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// ISR'de takılı kalıp yeni tarifleri göstermiyordu; her istekte güncel üretilsin.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const recipeUrls = recipes.map((r) => ({
    url: `https://goldene-rezepte.com/rezepte/${r.slug}`,
    lastModified: r.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://goldene-rezepte.com",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: "https://goldene-rezepte.com/rezepte",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: "https://goldene-rezepte.com/ueber-uns",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: "https://goldene-rezepte.com/kontakt",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: "https://goldene-rezepte.com/impressum",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: "https://goldene-rezepte.com/datenschutz",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    ...recipeUrls,
  ];
}
