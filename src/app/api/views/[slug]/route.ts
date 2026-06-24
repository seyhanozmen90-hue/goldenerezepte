import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ slug: string }> };

export async function POST(_req: NextRequest, context: Context) {
  // Admin girişi varsa sayma
  const session = await getServerSession(authOptions);
  if (session) return NextResponse.json({ ok: true });

  const { slug } = await context.params;
  await prisma.recipe.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });
  return NextResponse.json({ ok: true });
}
