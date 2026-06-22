import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";
import RezepteClient from "./RezepteClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Alle Rezepte – GoldeneRezepte",
  description: "Durchsuche unsere Sammlung an schnellen, einfachen und leckeren Rezepten.",
};

export default async function RezeptePage() {
  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, slug: true, title: true, description: true,
      category: true, cookTime: true, imageUrl: true,
    },
  });

  return (
    <>
      <NavBar />
      <RezepteClient recipes={recipes} />
    </>
  );
}
