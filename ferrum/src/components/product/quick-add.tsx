"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import type { ProductCardDTO } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

/** Ajout direct si une seule variante, sinon lien vers la fiche pour choisir taille/couleur. */
export function QuickAdd({ product }: { product: ProductCardDTO }) {
  const add = useCart((s) => s.add);
  const v = product.quickVariant;
  if (!v) {
    return (
      <Link
        href={`/product/${product.slug}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-iron-700 text-chalk-dim transition hover:border-chalk hover:text-chalk"
        aria-label={`Choisir les options de ${product.name}`}
      >
        <Plus size={17} />
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() =>
        add({
          productId: product.id,
          variantId: v.id,
          slug: product.slug,
          name: product.name,
          variantName: v.name,
          image: v.image,
          unitPrice: v.price,
          maxStock: v.stock,
        })
      }
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-plate-red text-chalk transition hover:bg-plate-red-dark"
      aria-label={`Ajouter ${product.name} au panier`}
    >
      <Plus size={17} />
    </button>
  );
}
