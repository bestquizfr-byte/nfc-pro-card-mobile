import Image from "next/image";
import Link from "next/link";
import type { ProductCardDTO } from "@/lib/types";
import { Price } from "@/components/ui/price";
import { Stars } from "@/components/ui/stars";
import { QuickAdd } from "./quick-add";

export function ProductCard({ product, priority = false }: { product: ProductCardDTO; priority?: boolean }) {
  const soldOut = product.totalStock === 0;
  return (
    <article className="group relative flex flex-col" data-testid="product-card">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-lg bg-iron-900">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-0"
          priority={priority}
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut ? (
            <span className="rounded-sm bg-iron-700 px-2 py-1 text-xs font-bold uppercase tracking-wide">Épuisé</span>
          ) : (
            product.badge && (
              <span className="rounded-sm bg-chalk px-2 py-1 text-xs font-bold uppercase tracking-wide text-iron-950">{product.badge}</span>
            )
          )}
        </div>
      </Link>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-chalk-dim">
          <Stars rating={product.rating} size={13} />
          <span>({product.reviewCount})</span>
        </div>
        <h3 className="font-semibold leading-snug">
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        {product.colors.length > 1 && (
          <div className="flex gap-1.5" aria-label={`${product.colors.length} coloris`}>
            {product.colors.map((c) => (
              <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full border border-chalk/30" style={{ background: c.hex }} />
            ))}
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <Price price={product.price} compareAt={product.compareAtPrice} size="sm" />
          {!soldOut && <QuickAdd product={product} />}
        </div>
      </div>
    </article>
  );
}
