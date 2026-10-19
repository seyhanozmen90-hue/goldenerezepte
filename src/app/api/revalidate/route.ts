import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Wird von den Skripten in scripts/new-recipes aufgerufen, damit neue oder geänderte
// Rezepte sofort sichtbar sind statt erst nach Ablauf des ISR-Caches.
export async function POST(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paths } = (await req.json().catch(() => ({}))) as { paths?: unknown };
  if (!Array.isArray(paths) || !paths.every((p) => typeof p === "string" && p.startsWith("/"))) {
    return NextResponse.json({ error: "paths must be an array of absolute paths" }, { status: 400 });
  }

  for (const p of paths) revalidatePath(p);
  return NextResponse.json({ revalidated: paths });
}
