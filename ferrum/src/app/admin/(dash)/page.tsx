import Link from "next/link";
import { AlertTriangle, Euro, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/format";
import { ORDER_STATUSES, STATUS_STYLES, type OrderStatus } from "@/lib/order-status";

export const metadata = { title: "Tableau de bord" };

const LOW_STOCK = 5;

export default async function AdminDashboard() {
  const [orders, lowStock, productCount, subscribers] = await Promise.all([
    prisma.order.findMany({ include: { items: { include: { product: { select: { costPrice: true } } } } }, orderBy: { createdAt: "desc" } }),
    prisma.variant.findMany({
      where: { stock: { lte: LOW_STOCK } },
      include: { product: { select: { name: true, id: true } } },
      orderBy: { stock: "asc" },
    }),
    prisma.product.count(),
    prisma.subscriber.count(),
  ]);
  const paid = orders.filter((o) => !["PENDING", "CANCELLED"].includes(o.status));
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const cost = paid.reduce((s, o) => s + o.items.reduce((c, i) => c + (i.product?.costPrice ?? 0) * i.quantity, 0), 0);
  const revenueHT = Math.round(revenue / 1.2);
  const margin = revenueHT - cost;
  const aov = paid.length ? Math.round(revenue / paid.length) : 0;

  const kpis = [
    { label: "Chiffre d'affaires TTC", value: formatPrice(revenue), icon: Euro, hint: `${formatPrice(revenueHT)} HT` },
    { label: "Commandes", value: String(orders.length), icon: ShoppingCart, hint: `${paid.length} payées · panier moyen ${formatPrice(aov)}` },
    {
      label: "Marge brute estimée",
      value: formatPrice(margin),
      icon: TrendingUp,
      hint: revenueHT ? `${Math.round((margin / revenueHT) * 100)} % du CA HT (hors pub)` : "—",
    },
    { label: "Stock faible", value: String(lowStock.length), icon: AlertTriangle, hint: `variantes ≤ ${LOW_STOCK} unités`, alert: lowStock.length > 0 },
  ];

  return (
    <div>
      <h1 className="display text-5xl font-extrabold">Tableau de bord</h1>
      <p className="mt-2 text-chalk-dim">
        {productCount} produits · {subscribers} inscrit{subscribers > 1 ? "s" : ""} newsletter
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" data-testid="kpis">
        {kpis.map(({ label, value, icon: Icon, hint, alert }) => (
          <div key={label} className={`rounded-xl border bg-iron-900 p-5 ${alert ? "border-plate-yellow/50" : "border-iron-800"}`}>
            <div className="flex items-center justify-between text-sm text-chalk-dim">
              {label}
              <Icon size={18} className={alert ? "text-plate-yellow" : ""} />
            </div>
            <p className="mt-3 font-display text-4xl font-bold tabular-nums">{value}</p>
            <p className="mt-1 text-sm text-chalk-dim">{hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-iron-800 bg-iron-900 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold uppercase">Dernières commandes</h2>
            <Link href="/admin/orders" className="text-sm text-chalk-dim hover:text-chalk">
              Tout voir
            </Link>
          </div>
          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-chalk-dim">
              <tr>
                <th className="py-2 font-medium">N°</th>
                <th className="py-2 font-medium">Client</th>
                <th className="hidden py-2 font-medium sm:table-cell">Date</th>
                <th className="py-2 font-medium">Statut</th>
                <th className="py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-iron-800">
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id}>
                  <td className="py-3 font-semibold">{o.number}</td>
                  <td className="py-3">
                    {o.firstName} {o.lastName}
                  </td>
                  <td className="hidden py-3 text-chalk-dim sm:table-cell">{formatDate(o.createdAt)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[o.status as OrderStatus]}`}>
                      {ORDER_STATUSES[o.status as OrderStatus]}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-iron-800 bg-iron-900 p-5" data-testid="low-stock-list">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold uppercase">
            <Package size={20} /> Stock faible
          </h2>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-chalk-dim">Rien à signaler, tous les stocks sont au-dessus de {LOW_STOCK}.</p>
          ) : (
            <ul className="mt-4 divide-y divide-iron-800 text-sm">
              {lowStock.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link href={`/admin/products/${v.product.id}`} className="min-w-0 hover:underline">
                    <span className="block truncate font-medium">{v.product.name}</span>
                    <span className="text-chalk-dim">{v.name}</span>
                  </Link>
                  <span className={`shrink-0 font-semibold tabular-nums ${v.stock === 0 ? "text-[#ff6b72]" : "text-plate-yellow"}`}>
                    {v.stock === 0 ? "Épuisé" : `${v.stock} restant${v.stock > 1 ? "s" : ""}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
