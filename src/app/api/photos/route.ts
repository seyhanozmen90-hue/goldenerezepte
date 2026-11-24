import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_PENDING = 60;
const PER_HOUR = 3;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Decide the real type from the file's first bytes, not from the name or the browser's claim.
function sniff(buf: Buffer): { ext: string; type: string } | null {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (buf.length > 12 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: "png", type: "image/png" };
  if (buf.length > 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return { ext: "webp", type: "image/webp" };
  return null;
}

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) return fail("Ungültige Anfrage.");

  // Honeypot: real visitors never see or fill this field.
  if (String(form.get("website") ?? "") !== "") return NextResponse.json({ ok: true });

  if (form.get("consent") !== "yes") return fail("Bitte bestätige, dass du das Foto selbst gemacht hast und der Veröffentlichung zustimmst.");

  const recipeId = Number(form.get("recipeId"));
  const file = form.get("file");
  if (!Number.isInteger(recipeId) || !(file instanceof File)) return fail("Bitte wähle ein Foto aus.");
  if (file.size > MAX_BYTES) return fail("Das Foto ist zu groß (maximal 5 MB).");

  const name = String(form.get("name") ?? "").trim().slice(0, 40) || null;
  const comment = String(form.get("comment") ?? "").trim().slice(0, 500) || null;

  const recipe = await prisma.recipe.findFirst({ where: { id: recipeId, published: true }, select: { id: true } });
  if (!recipe) return fail("Rezept nicht gefunden.", 404);

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind) return fail("Bitte nur JPG-, PNG- oder WebP-Fotos hochladen.");

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const ipHash = createHash("sha256").update(ip + (process.env.NEXTAUTH_SECRET ?? "")).digest("hex").slice(0, 24);

  const [recent, pending] = await Promise.all([
    prisma.readerPhoto.count({ where: { ipHash, createdAt: { gt: new Date(Date.now() - 3600_000) } } }),
    prisma.readerPhoto.count({ where: { status: "pending" } }),
  ]);
  if (recent >= PER_HOUR) return fail("Du hast gerade schon mehrere Fotos geschickt. Bitte versuche es später noch einmal.", 429);
  if (pending >= MAX_PENDING) return fail("Gerade warten viele Fotos auf Freigabe. Bitte versuche es in ein paar Tagen noch einmal.", 429);

  const path = `reader-photos/${recipeId}-${Date.now()}-${randomBytes(4).toString("hex")}.${kind.ext}`;
  const { error } = await supabase.storage.from("recipe-images").upload(path, buf, { contentType: kind.type, upsert: false });
  if (error) return fail("Das Foto konnte nicht gespeichert werden. Bitte versuche es später noch einmal.", 500);

  const { data } = supabase.storage.from("recipe-images").getPublicUrl(path);
  await prisma.readerPhoto.create({ data: { recipeId, name, comment, path, url: data.publicUrl, ipHash } });

  return NextResponse.json({ ok: true });
}
