"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { formatPrice, cn } from "@/lib/format";
import { btn } from "@/components/ui/button";

type Pick = { product: ProductDTO; variantId: string; checked: boolean };

/** "Souvent acheté ensemble" : le produit courant + ses compléments, ajout groupé en 1 clic. */
export function FrequentlyBought({ main, others }: { main: ProductDTO; others: ProductDTO[] }) {
  const add = useCart((s) => s.add);
  const defaultVariant = (p: ProductDTO) => p.variants.reduce((best, v) => (v.stock > best.stock ? v : best), p.variants[0]).id;
  const [picks, setPicks] = useState<Pick[]>(() =>
    [main, ...others].map((p) => ({ product: p, variantId: defaultVariant(p), checked: true })),
  );

  const selected = picks.filter((p) => p.checked);
  const priceOf = (p: Pick) => {
    const v = p.product.variants.find((x) => x.id === p.variantId);
    return v?.price ?? p.product.price;
  };
  const total = selected.reduce((s, p) => s + priceOf(p), 0);

  function addAll() {
    for (const p of selected) {
      const v = p.product.variants.find((x) => x.id === p.variantId)!;
      add({
        productId: p.product.id,
        variantId: v.id,
        slug: p.product.slug,
        name: p.product.name,
        variantName: v.name,
        image: v.image ?? p.product.images[0],
        unitPrice: v.price ?? p.product.price,
        maxStock: v.stock,
      });
    }
  }

  return (
    <section className="rounded-xl border border-iron-800 bg-iron-900 p-5 sm:p-8" aria-labelledby="fbt-title" data-testid="upsell">
      <h2 id="fbt-title" className="display text-4xl font-extrabold">
        Souvent acheté ensemble
      </h2>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {picks.map((p, i) => (
          <div key={p.product.id} className="flex items-center gap-3">
            {i > 0 && <Plus size={18} className="text-iron-400" />}
            <Link
              href={`/product/${p.product.slug}`}
              className={cn("relative h-24 w-24 overflow-hidden rounded-md bg-iron-800 transition", !p.checked && "opacity-35")}
            >
              <Image src={p.product.images[0]} alt={p.product.name} fill sizes="96px" className="object-cover" />
            </Link>
          </div>
        ))}
      </div>
      <ul className="mt-6 space-y-3">
        {picks.map((p, i) => (
          <li key={p.product.id} className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <input
              type="checkbox"
              id={`fbt-${p.product.id}`}
              checked={p.checked}
              disabled={i === 0}
              onChange={(e) => setPicks((all) => all.map((x, j) => (j === i ? { ...x, checked: e.target.checked } : x)))}
              className="h-4 w-4 accent-plate-red"
            />
            <label htmlFor={`fbt-${p.product.id}`} className="text-[15px]">
              {i === 0 ? <strong>Cet article : </strong> : null}
              {p.product.name}
            </label>
            {p.product.variants.length > 1 && (
              <select
                value={p.variantId}
                onChange={(e) => setPicks((all) => all.map((x, j) => (j === i ? { ...x, variantId: e.target.value } : x)))}
                className="rounded border border-iron-700 bg-iron-850 px-2 py-1 text-sm"
                aria-label={`Option pour ${p.product.name}`}
              >
                {p.product.variants.map((v) => (
                  <option key={v.id} value={v.id} disabled={v.stock === 0}>
                    {v.name}
                    {v.stock === 0 ? " (épuisé)" : ""}
                  </option>
                ))}
              </select>
            )}
            <span className="ml-auto font-semibold">{formatPrice(priceOf(p))}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col gap-3 border-t border-iron-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Total : <strong className="font-display text-2xl">{formatPrice(total)}</strong>
        </p>
        <button type="button" onClick={addAll} className={btn.primary} data-testid="upsell-add">
          Ajouter les {selected.length} au panier
        </button>
      </div>
    </section>
  );
}
