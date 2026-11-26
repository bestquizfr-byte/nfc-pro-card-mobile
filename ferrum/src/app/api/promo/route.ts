import { NextResponse, type NextRequest } from "next/server";
import { findPromo } from "@/lib/order";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code") ?? "";
  const promo = await findPromo(code);
  if (!promo) return NextResponse.json({ valid: false, message: "Ce code n'existe pas ou a expiré." });
  return NextResponse.json({ valid: true, code: promo.code, percent: promo.percent });
}
