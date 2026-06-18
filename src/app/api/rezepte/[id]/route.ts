import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const recipe = await prisma.recipe.findUnique({ where: { id: Number(params.id) } });
  if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(recipe);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const recipe = await prisma.recipe.update({
    where: { id: Number(params.id) },
    data: {
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
  return NextResponse.json(recipe);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const recipe = await prisma.recipe.update({
    where: { id: Number(params.id) },
    data: body,
  });
  return NextResponse.json(recipe);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.recipe.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
