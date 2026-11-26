import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { markOrderPaid, ORDER_STATUSES, type OrderStatus } from "@/lib/order";
import { formatDate, formatPrice } from "@/lib/format";
import { btn } from "@/components/ui/button";
import { ClearCart } from "@/components/checkout/clear-cart";

export const metadata: Metadata = { title: "Commande confirmée", robots: { index: false } };
export const dynamic = "force-dynamic";

const maskEmail = (e: string) => e.replace(/^(.{2})[^@]*(@.*)$/, "$1•••$2");

export default async function SuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const sp = await searchParams;
  const number = typeof sp.order === "string" ? sp.order : "";
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : "";
  let order = await prisma.order.findUnique({ where: { number }, include: { items: true } });
  if (!order) notFound();

  // Retour Stripe : on vérifie la session (utile si le webhook n'est pas branché en local).
  if (stripe && sessionId && order.status === "PENDING" && order.stripeSessionId === sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      await markOrderPaid(order.id);
      order = await prisma.order.findUniqueOrThrow({ where: { number }, include: { items: true } });
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-14 sm:px-6">
      <ClearCart />
      <div className="text-center">
        <CheckCircle2 size={56} className="mx-auto text-plate-green" />
        <h1 className="display mt-5 text-6xl font-extrabold">Merci {order.firstName} !</h1>
        <p className="mt-4 text-lg text-chalk/85">
          Ta commande <strong data-testid="order-number">{order.number}</strong> est confirmée. Un e-mail de confirmation part vers{" "}
          {maskEmail(order.email)}.
        </p>
        {order.paymentMode === "DEMO" && (
          <p className="mx-auto mt-4 max-w-md rounded-md border border-plate-blue/50 bg-plate-blue/10 p-3 text-sm">
            Mode démo : paiement simulé, aucun débit n&apos;a été effectué.
          </p>
        )}
      </div>

      <section className="mt-10 rounded-xl border border-iron-800 bg-iron-900 p-6" aria-label="Récapitulatif de commande">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-iron-800 pb-4">
          <p className="text-sm text-chalk-dim">Passée le {formatDate(order.createdAt)}</p>
          <span className="rounded-full bg-plate-green/15 px-3 py-1 text-sm font-semibold text-plate-green" data-testid="order-status">
            {ORDER_STATUSES[order.status as OrderStatus] ?? order.status}
          </span>
        </div>
        <ul className="divide-y divide-iron-800">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center gap-4 py-4">
              <Image src={i.image} alt={i.name} width={64} height={64} className="rounded-md bg-iron-800" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{i.name}</p>
                <p className="text-sm text-chalk-dim">
                  {i.variantName} · Qté {i.quantity}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(i.unitPrice * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="space-y-1.5 border-t border-iron-800 pt-4 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-chalk-dim">Sous-total</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-plate-green">
              <dt>Réduction ({order.promoCode})</dt>
              <dd>−{formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-chalk-dim">Livraison</dt>
            <dd>{order.shipping === 0 ? "Offerte" : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-lg font-bold">
            <dt>Total payé</dt>
            <dd data-testid="order-total">{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-6 flex items-start gap-3 rounded-md bg-iron-850 p-4 text-sm">
          <Package size={18} className="mt-0.5 shrink-0 text-chalk-dim" />
          <p>
            Livraison à {order.city} ({order.postalCode}), {order.country}. Expédition sous 24 h ouvrées, tu recevras le numéro de suivi
            par e-mail.
          </p>
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link href="/shop" className={btn.secondary}>
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
