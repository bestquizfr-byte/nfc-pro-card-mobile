import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Adresse e-mail invalide." }, { status: 400 });
  await prisma.subscriber.upsert({ where: { email: parsed.data.email }, update: {}, create: { email: parsed.data.email } });
  return NextResponse.json({ ok: true, message: "Bienvenue dans l'équipe ! Ton code : FORCE10 (−10 % sur ta 1re commande)." });
}
