import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { markOrderPaid } from "@/lib/order";

export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: false, message: "Stripe non configuré (mode démo)." }, { status: 400 });
  }
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const orderId = event.data.object.metadata?.orderId;
    if (orderId && event.data.object.payment_status === "paid") await markOrderPaid(orderId);
  }
  return NextResponse.json({ received: true });
}
