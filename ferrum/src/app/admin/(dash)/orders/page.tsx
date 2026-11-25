import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/format";
import { ORDER_STATUSES, STATUS_STYLES, type OrderStatus } from "@/lib/order-status";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const metadata = { title: "Commandes" };

export default async function AdminOrders({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const filter = typeof sp.statut === "string" && sp.statut in ORDER_STATUSES ? sp.statut : undefined;
  const orders = await prisma.order.findMany({
    where: filter ? { status: filter } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  const tabs = [{ key: "", label: "Toutes" }, ...Object.entries(ORDER_STATUSES).map(([key, label]) => ({ key, label }))];

  return (
    <div>
      <h1 className="display text-5xl font-extrabold">Commandes</h1>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key ? `/admin/orders?statut=${t.key}` : "/admin/orders"}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold ${
              (filter ?? "") === t.key ? "border-chalk bg-chalk text-iron-950" : "border-iron-700 text-chalk-dim hover:text-chalk"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      {orders.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-iron-700 p-10 text-center text-chalk-dim">Aucune commande pour ce filtre.</p>
      ) : (
        <ul className="mt-6 space-y-3" data-testid="orders-list">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border border-iron-800 bg-iron-900 p-5" data-testid="order-row" data-number={o.number}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-xl font-bold">{o.number}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[o.status as OrderStatus]}`} data-testid="order-status-badge">
                      {ORDER_STATUSES[o.status as OrderStatus]}
                    </span>
                    {o.paymentMode === "DEMO" && <span className="text-xs text-chalk-dim">paiement démo</span>}
                  </p>
                  <p className="mt-1 text-sm text-chalk-dim">
                    {formatDate(o.createdAt)} · {o.firstName} {o.lastName} · {o.email}
                  </p>
                  <p className="mt-1 text-sm text-chalk-dim">
                    {o.address}
                    {o.address2 ? `, ${o.address2}` : ""}, {o.postalCode} {o.city}, {o.country}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-display text-2xl font-bold tabular-nums">{formatPrice(o.total)}</p>
                  <OrderStatusSelect id={o.id} status={o.status} />
                </div>
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-iron-800 pt-3 text-sm">
                {o.items.map((i) => (
                  <li key={i.id}>
                    {i.quantity} × {i.name} <span className="text-chalk-dim">({i.variantName})</span>
                  </li>
                ))}
                {o.promoCode && <li className="text-plate-green">Code {o.promoCode} : −{formatPrice(o.discount)}</li>}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
