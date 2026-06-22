import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    select: { slug: true, createdAt: true },
  });

  const recipeUrls = recipes.map((r) => ({
    url: `https://goldenerezepte.vercel.app/rezepte/${r.slug}`,
    lastModified: r.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://goldenerezepte.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: "https://goldenerezepte.vercel.app/rezepte",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...recipeUrls,
  ];
}
