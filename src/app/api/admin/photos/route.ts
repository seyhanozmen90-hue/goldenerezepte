import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function authorized() {
  return !!(await getServerSession(authOptions));
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const photos = await prisma.readerPhoto.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }], take: 200 });
  const recipes = await prisma.recipe.findMany({
    where: { id: { in: [...new Set(photos.map((p) => p.recipeId))] } },
    select: { id: true, title: true, slug: true },
  });
  const byId = new Map(recipes.map((r) => [r.id, r]));
  return NextResponse.json(
    photos.map((p) => ({ ...p, ipHash: undefined, recipe: byId.get(p.recipeId) ?? null }))
  );
}

async function refresh(recipeId: number) {
  const r = await prisma.recipe.findUnique({ where: { id: recipeId }, select: { slug: true } });
  if (r) revalidatePath(`/rezepte/${r.slug}`);
}

export async function PATCH(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = (await req.json().catch(() => ({}))) as { id?: number; status?: string };
  if (!Number.isInteger(id) || (status !== "approved" && status !== "pending")) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const photo = await prisma.readerPhoto.update({ where: { id }, data: { status } });
  await refresh(photo.recipeId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = (await req.json().catch(() => ({}))) as { id?: number };
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const photo = await prisma.readerPhoto.delete({ where: { id } });
  await supabase.storage.from("recipe-images").remove([photo.path]);
  await refresh(photo.recipeId);
  return NextResponse.json({ ok: true });
}
