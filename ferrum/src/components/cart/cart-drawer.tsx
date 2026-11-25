"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, Lock } from "lucide-react";
import { cartCount, cartSubtotal, useCart, useCartHydrated } from "@/lib/cart-store";
import { computeTotals } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { btn } from "@/components/ui/button";
import { FreeShippingBar } from "./free-shipping-bar";
import { PromoField } from "./promo-field";

export function CartDrawer() {
  const hydrated = useCartHydrated();
  const { items, isOpen, close, setQuantity, remove, promo } = useCart();
  const totals = computeTotals(cartSubtotal(items), promo?.percent ?? 0);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {hydrated && isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
            data-testid="cart-drawer"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-iron-900 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
          >
            <div className="flex items-center justify-between border-b border-iron-800 px-5 py-4">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
                Panier <span className="text-chalk-dim">({cartCount(items)})</span>
              </h2>
              <button type="button" onClick={close} className="-mr-2 p-2 text-chalk-dim hover:text-chalk" aria-label="Fermer le panier">
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag size={44} className="text-iron-600" />
                <p className="font-display text-2xl font-bold uppercase">Ton panier est vide</p>
                <p className="text-chalk-dim">Les records ne se battent pas tout seuls.</p>
                <Link href="/shop" onClick={close} className={`${btn.primary} mt-2`}>
                  Voir les best-sellers
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-iron-800 px-5 py-4">
                  <FreeShippingBar remaining={totals.remainingForFreeShipping} />
                </div>
                <ul className="flex-1 divide-y divide-iron-800 overflow-y-auto px-5" data-testid="cart-items">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 py-4">
                      <Link href={`/product/${item.slug}`} onClick={close} className="shrink-0">
                        <Image src={item.image} alt={item.name} width={88} height={88} className="rounded-md bg-iron-800" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-3">
                          <div className="min-w-0">
                            <Link href={`/product/${item.slug}`} onClick={close} className="line-clamp-2 font-semibold leading-snug hover:underline">
                              {item.name}
                            </Link>
                            <p className="mt-0.5 text-sm text-chalk-dim">{item.variantName}</p>
                          </div>
                          <p className="shrink-0 font-semibold">{formatPrice(item.unitPrice * item.quantity)}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-md border border-iron-700">
                            <button
                              type="button"
                              className="p-2 text-chalk-dim hover:text-chalk"
                              onClick={() => setQuantity(item.key, item.quantity - 1)}
                              aria-label={`Diminuer la quantité de ${item.name}`}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums" data-testid="cart-qty">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="p-2 text-chalk-dim hover:text-chalk disabled:opacity-30"
                              onClick={() => setQuantity(item.key, item.quantity + 1)}
                              disabled={item.quantity >= item.maxStock}
                              aria-label={`Augmenter la quantité de ${item.name}`}
                              data-testid="cart-qty-plus"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(item.key)}
                            className="flex items-center gap-1 text-sm text-chalk-dim hover:text-[#ff6b72]"
                            aria-label={`Retirer ${item.name} du panier`}
                          >
                            <Trash2 size={15} /> Retirer
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="space-y-4 border-t border-iron-800 bg-iron-850 px-5 py-5">
                  <PromoField />
                  <dl className="space-y-1.5 text-[15px]">
                    <div className="flex justify-between">
                      <dt className="text-chalk-dim">Sous-total</dt>
                      <dd>{formatPrice(totals.subtotal)}</dd>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-plate-green">
                        <dt>Réduction ({promo?.code})</dt>
                        <dd data-testid="cart-discount">−{formatPrice(totals.discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-chalk-dim">Livraison</dt>
                      <dd>{totals.shipping === 0 ? "Offerte" : formatPrice(totals.shipping)}</dd>
                    </div>
                    <div className="flex justify-between pt-2 text-lg font-bold">
                      <dt>Total TTC</dt>
                      <dd data-testid="cart-total">{formatPrice(totals.total)}</dd>
                    </div>
                  </dl>
                  <Link href="/checkout" onClick={close} className={`${btn.primary} w-full`} data-testid="checkout-link">
                    <Lock size={17} /> Passer commande
                  </Link>
                  <button type="button" onClick={close} className="w-full text-center text-sm text-chalk-dim hover:text-chalk">
                    Continuer mes achats
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
