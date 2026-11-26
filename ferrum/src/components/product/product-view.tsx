"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Minus, Plus, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { ProductDTO, VariantDTO } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { btn } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Stars } from "@/components/ui/stars";
import { cn } from "@/lib/format";
import { Gallery } from "./gallery";
import { Accordion } from "./accordion";

const unique = <T,>(arr: (T | null)[]) => [...new Set(arr.filter((x): x is T => x !== null))];

export function ProductView({ product }: { product: ProductDTO }) {
  const add = useCart((s) => s.add);
  const colors = useMemo(() => unique(product.variants.map((v) => v.color)), [product.variants]);
  const sizes = useMemo(() => unique(product.variants.map((v) => v.size)), [product.variants]);
  const firstAvailable = product.variants.find((v) => v.stock > 0) ?? product.variants[0];

  const [color, setColor] = useState<string | null>(firstAvailable?.color ?? null);
  // Tailles vêtement (guide des tailles) : choix explicite obligatoire. Formats (ex. 100 ml) : présélectionnés.
  const mustPickSize = sizes.length > 1 && !!product.sizeGuide;
  const sizeLabel = product.sizeGuide ? "Taille" : "Format";
  const [size, setSize] = useState<string | null>(mustPickSize ? null : (firstAvailable?.size ?? null));
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const variant: VariantDTO | undefined = product.variants.find(
    (v) => (colors.length === 0 || v.color === color) && (sizes.length === 0 || v.size === size),
  );
  const colorVariant = product.variants.find((v) => v.color === color) ?? firstAvailable;
  const unitPrice = variant?.price ?? product.price;
  const compareAt = variant?.price ? null : product.compareAtPrice;

  // Image principale = visuel du coloris choisi.
  const images = useMemo(() => {
    const img = (variant ?? colorVariant)?.image;
    return img ? [img, ...product.images.slice(1)] : product.images;
  }, [variant, colorVariant, product.images]);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0), {
      threshold: 0,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stockFor = (c: string | null, s: string | null) =>
    product.variants.find((v) => (c === null || v.color === c) && (s === null || v.size === s))?.stock ?? 0;

  function addToCart() {
    if (sizes.length > 1 && !size) {
      setSizeError(true);
      document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!variant || variant.stock === 0) return;
    add(
      {
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        name: product.name,
        variantName: variant.name,
        image: variant.image ?? product.images[0],
        unitPrice,
        maxStock: variant.stock,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const soldOut = variant ? variant.stock === 0 : product.totalStock === 0;
  const lowStock = variant && variant.stock > 0 && variant.stock <= 5;
  const ctaLabel = soldOut ? "Épuisé" : sizes.length > 1 && !size ? (product.sizeGuide ? "Choisis ta taille" : "Choisis ton format") : added ? "Ajouté au panier" : "Ajouter au panier";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Gallery
          images={images}
          active={Math.min(activeImage, images.length - 1)}
          onSelect={setActiveImage}
          name={product.name}
        />
      </div>

      <div>
        {product.badge && (
          <span className="inline-block rounded-sm bg-chalk px-2 py-1 text-xs font-bold uppercase tracking-wide text-iron-950">
            {product.badge}
          </span>
        )}
        <h1 className="display mt-3 text-5xl font-extrabold sm:text-6xl">{product.name}</h1>
        <a href="#avis" className="mt-3 inline-flex items-center gap-2 text-sm text-chalk-dim hover:text-chalk">
          <Stars rating={product.rating} size={16} />
          {product.rating.toFixed(1)} · {product.reviewCount} avis
        </a>
        <p className="mt-4 text-lg leading-relaxed text-chalk/85">{product.tagline}</p>
        <div className="mt-5" data-testid="product-price">
          <Price price={unitPrice} compareAt={compareAt} size="lg" />
          <p className="mt-1 text-sm text-chalk-dim">TTC · livraison offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)}</p>
        </div>

        <ul className="mt-6 space-y-2">
          {product.benefits.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-plate-green" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Coloris */}
        {colors.length > 0 && (
          <fieldset className="mt-8">
            <legend className="text-sm">
              Coloris : <strong className="font-semibold">{color}</strong>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {colors.map((c) => {
                const hex = product.variants.find((v) => v.color === c)?.colorHex ?? "#888";
                const out = stockFor(c, null) === 0 && product.variants.filter((v) => v.color === c).every((v) => v.stock === 0);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setColor(c);
                      setActiveImage(0);
                    }}
                    aria-pressed={color === c}
                    aria-label={`${c}${out ? " (épuisé)" : ""}`}
                    title={c}
                    className={cn(
                      "relative h-10 w-10 rounded-full border-2 p-0.5 transition",
                      color === c ? "border-chalk" : "border-iron-700 hover:border-chalk/60",
                      out && "opacity-40",
                    )}
                  >
                    <span className="block h-full w-full rounded-full border border-chalk/20" style={{ background: hex }} />
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Tailles */}
        {sizes.length > 1 && (
          <fieldset className="mt-6" id="size-picker">
            <legend className="flex w-full items-center justify-between text-sm">
              <span>
                {sizeLabel} : <strong className="font-semibold">{size ?? "—"}</strong>
              </span>
              {product.sizeGuide && (
                <a href="#guide-tailles" className="text-chalk-dim underline underline-offset-4 hover:text-chalk">
                  Guide des tailles
                </a>
              )}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {sizes.map((s) => {
                const stock = stockFor(colors.length ? color : null, s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={stock === 0}
                    onClick={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                    aria-pressed={size === s}
                    data-testid={`size-${s}`}
                    className={cn(
                      "min-w-14 rounded-md border px-4 py-2.5 text-sm font-semibold transition",
                      size === s ? "border-chalk bg-chalk text-iron-950" : "border-iron-700 hover:border-chalk/60",
                      stock === 0 && "cursor-not-allowed text-iron-600 line-through",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {sizeError && (
              <p className="mt-2 text-sm text-[#ff6b72]" role="alert">
                {product.sizeGuide ? "Choisis une taille" : "Choisis un format"} pour continuer.
              </p>
            )}
          </fieldset>
        )}

        <div className="mt-8 flex gap-3" ref={ctaRef}>
          <div className="flex items-center rounded-md border border-iron-700">
            <button
              type="button"
              className="px-3 py-3.5 text-chalk-dim hover:text-chalk"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Diminuer la quantité"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              className="px-3 py-3.5 text-chalk-dim hover:text-chalk"
              onClick={() => setQty((q) => Math.min(variant?.stock ?? 10, q + 1, 10))}
              aria-label="Augmenter la quantité"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={addToCart}
            disabled={soldOut}
            className={cn(btn.primary, "flex-1", added && "!bg-plate-green")}
            data-testid="add-to-cart"
          >
            {added && <Check size={19} />}
            {ctaLabel}
          </button>
        </div>
        {lowStock && (
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-plate-yellow" data-testid="low-stock">
            <span className="h-2 w-2 animate-pulse rounded-full bg-plate-yellow" />
            Plus que {variant!.stock} en stock
          </p>
        )}

        <ul className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-chalk-dim">
          <li className="flex flex-col items-center gap-1.5 rounded-md bg-iron-900 px-2 py-3">
            <Truck size={18} className="text-chalk" /> Expédié sous 24 h
          </li>
          <li className="flex flex-col items-center gap-1.5 rounded-md bg-iron-900 px-2 py-3">
            <RotateCcw size={18} className="text-chalk" /> Retours 30 jours
          </li>
          <li className="flex flex-col items-center gap-1.5 rounded-md bg-iron-900 px-2 py-3">
            <ShieldCheck size={18} className="text-chalk" /> Paiement sécurisé
          </li>
        </ul>

        <div className="mt-8 border-t border-iron-800">
          <Accordion title="Description" defaultOpen>
            <p>{product.description}</p>
          </Accordion>
          <Accordion title="Caractéristiques">
            <dl className="divide-y divide-iron-800">
              {product.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[140px_1fr] gap-4 py-2.5">
                  <dt className="text-chalk-dim">{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </Accordion>
          {product.sizeGuide && (
            <Accordion title="Guide des tailles" id="guide-tailles">
              <p className="mb-3">{product.sizeGuide.title}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-iron-700">
                      {product.sizeGuide.headers.map((h) => (
                        <th key={h} scope="col" className="py-2 pr-4 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeGuide.rows.map((r) => (
                      <tr key={r[0]} className="border-b border-iron-800">
                        {r.map((cell, i) => (
                          <td key={i} className={cn("py-2 pr-4", i === 0 && "font-semibold")}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {product.sizeGuide.note && <p className="mt-3 text-chalk-dim">{product.sizeGuide.note}</p>}
            </Accordion>
          )}
          <Accordion title="Livraison">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Expédition sous 24 h ouvrées, suivi par e-mail.</li>
              <li>Livraison en 3 à 5 jours ouvrés en France métropolitaine.</li>
              <li>Offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)} d&apos;achat, sinon 4,90 €.</li>
              <li>Belgique, Luxembourg, Suisse : 5 à 8 jours ouvrés.</li>
            </ul>
          </Accordion>
          <Accordion title="Retours & garantie">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>30 jours pour retourner ou échanger un article non utilisé.</li>
              <li>Échange de taille gratuit.</li>
              <li>Garantie légale de conformité de 2 ans sur tous les produits.</li>
            </ul>
          </Accordion>
        </div>
      </div>

      {/* CTA collant mobile */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-iron-800 bg-iron-950/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden",
          showSticky ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!showSticky}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <p className="text-sm text-chalk-dim">
              {formatPrice(unitPrice)}
              {size ? ` · ${size}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={addToCart}
            disabled={soldOut}
            tabIndex={showSticky ? 0 : -1}
            className={cn(btn.primary, "!px-5 !py-3 !text-base", added && "!bg-plate-green")}
          >
            {soldOut ? "Épuisé" : added ? "Ajouté" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
