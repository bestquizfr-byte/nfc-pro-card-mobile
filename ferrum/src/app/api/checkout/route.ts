import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutRequestSchema } from "@/lib/validation";
import { generateOrderNumber, markOrderPaid, priceCart } from "@/lib/order";
import { siteUrl, stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const parsed = checkoutRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Formulaire invalide.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const { customer, items, promoCode } = parsed.data;

  // Prix, remise et stock recalculés côté serveur : le client n'est jamais cru sur parole.
  const cart = await priceCart(items, promoCode);
  if (cart.errors.length || cart.items.length === 0) {
    return NextResponse.json({ ok: false, message: cart.errors[0] ?? "Panier vide." }, { status: 409 });
  }

  const number = await generateOrderNumber();
  const order = await prisma.order.create({
    data: {
      number,
      ...customer,
      address2: customer.address2 || null,
      phone: customer.phone || null,
      subtotal: cart.totals.subtotal,
      discount: cart.totals.discount,
      shipping: cart.totals.shipping,
      total: cart.totals.total,
      promoCode: cart.promo?.code ?? null,
      paymentMode: stripe ? "STRIPE" : "DEMO",
      items: { create: cart.items },
    },
  });

  // MODE DÉMO : pas de clé Stripe → paiement simulé, commande payée immédiatement.
  if (!stripe) {
    await markOrderPaid(order.id);
    return NextResponse.json({ ok: true, url: `/checkout/success?order=${number}`, demo: true });
  }

  // MODE STRIPE : la remise est répartie sur les lignes (montants entiers en centimes).
  const ratio = cart.totals.subtotal ? (cart.totals.subtotal - cart.totals.discount) / cart.totals.subtotal : 1;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customer.email,
    locale: "fr",
    line_items: [
      ...cart.items.map((i) => ({
        quantity: i.quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(i.unitPrice * ratio),
          product_data: {
            name: i.name,
            description: i.variantName,
            images: i.image.startsWith("http") ? [i.image] : [`${siteUrl()}${i.image}`],
          },
        },
      })),
      ...(cart.totals.shipping > 0
        ? [{ quantity: 1, price_data: { currency: "eur", unit_amount: cart.totals.shipping, product_data: { name: "Livraison" } } }]
        : []),
    ],
    metadata: { orderId: order.id, orderNumber: number },
    success_url: `${siteUrl()}/checkout/success?order=${number}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/checkout?annule=1`,
  });
  await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
  return NextResponse.json({ ok: true, url: session.url });
}
