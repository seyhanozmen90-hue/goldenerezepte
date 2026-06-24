import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(recipes, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = slugify(body.title);

  const recipe = await prisma.recipe.create({
    data: {
      slug,
      title: body.title,
      description: body.description,
      category: body.category,
      prepTime: Number(body.prepTime),
      cookTime: Number(body.cookTime),
      servings: Number(body.servings),
      difficulty: body.difficulty,
      imageUrl: body.imageUrl || null,
      ingredients: body.ingredients,
      steps: body.steps,
      published: body.published ?? false,
    },
  });
  revalidatePath("/rezepte");
  revalidatePath("/");
  return NextResponse.json(recipe);
}
