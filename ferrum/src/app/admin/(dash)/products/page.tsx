import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { CATEGORIES } from "@/data/catalog";
import { btn } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const metadata = { title: "Produits" };

export default async function AdminProducts({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const products = await prisma.product.findMany({ include: { variants: { select: { stock: true } } }, orderBy: { popularity: "desc" } });
  const flash = sp.cree ? "Produit créé." : sp.supprime ? "Produit supprimé." : "";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-5xl font-extrabold">Produits</h1>
          <p className="mt-2 text-chalk-dim">{products.length} produits · prix d&apos;achat et marge calculés hors TVA</p>
        </div>
        <Link href="/admin/products/new" className={btn.primary} data-testid="new-product">
          <Plus size={18} /> Nouveau produit
        </Link>
      </div>
      {flash && (
        <p className="mt-4 rounded-md border border-plate-green/40 bg-plate-green/10 p-3 text-sm" role="status">
          {flash}
        </p>
      )}
      <div className="mt-8 overflow-x-auto rounded-xl border border-iron-800 bg-iron-900">
        <table className="w-full min-w-[860px] text-left text-sm" data-testid="products-table">
          <thead className="border-b border-iron-800 text-chalk-dim">
            <tr>
              <th className="px-4 py-3 font-medium">Produit</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 text-right font-medium">Prix TTC</th>
              <th className="px-4 py-3 text-right font-medium">Achat</th>
              <th className="px-4 py-3 text-right font-medium">Marge HT</th>
              <th className="px-4 py-3 text-right font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Fournisseur</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-iron-800">
            {products.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              const ht = p.price / 1.2;
              const marginPct = Math.round(((ht - p.costPrice) / ht) * 100);
              const img = (JSON.parse(p.images) as string[])[0];
              return (
                <tr key={p.id} className={p.active ? "" : "opacity-50"}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {img && <Image src={img} alt="" width={44} height={44} className="rounded bg-iron-800" />}
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-chalk-dim">
                          /{p.slug} {!p.active && "· masqué"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-chalk-dim">{CATEGORIES.find((c) => c.slug === p.category)?.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-chalk-dim">{formatPrice(p.costPrice)}</td>
                  <td className={`px-4 py-3 text-right font-semibold tabular-nums ${marginPct >= 55 ? "text-plate-green" : marginPct >= 40 ? "text-plate-yellow" : "text-[#ff6b72]"}`}>
                    {marginPct} %
                  </td>
                  <td className={`px-4 py-3 text-right tabular-nums ${stock <= 10 ? "font-semibold text-plate-yellow" : ""}`}>{stock}</td>
                  <td className="px-4 py-3">
                    <a href={p.supplierUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-chalk-dim hover:text-chalk">
                      AliExpress <ExternalLink size={13} />
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/products/${p.id}`} className="rounded p-2 text-chalk-dim hover:bg-iron-800 hover:text-chalk" aria-label={`Modifier ${p.name}`}>
                        <Pencil size={16} />
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
