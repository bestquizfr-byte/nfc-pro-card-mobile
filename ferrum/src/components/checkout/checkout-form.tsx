"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Info, Lock, ShieldCheck } from "lucide-react";
import { cartSubtotal, useCart, useCartHydrated } from "@/lib/cart-store";
import { computeTotals } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation";
import { btn, input } from "@/components/ui/button";
import { FreeShippingBar } from "@/components/cart/free-shipping-bar";
import { PromoField } from "@/components/cart/promo-field";

type Errors = Partial<Record<keyof CheckoutInput, string>>;

const empty: CheckoutInput = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  address2: "",
  postalCode: "",
  city: "",
  country: "France",
  phone: "",
};

export function CheckoutForm({ demo }: { demo: boolean }) {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const promo = useCart((s) => s.promo);
  const [values, setValues] = useState<CheckoutInput>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const totals = computeTotals(cartSubtotal(items), promo?.percent ?? 0);

  const set = (k: keyof CheckoutInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const parsed = checkoutSchema.safeParse(values);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      const next: Errors = {};
      for (const [k, v] of Object.entries(fe)) next[k as keyof CheckoutInput] = v?.[0];
      setErrors(next);
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: parsed.data,
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
          promoCode: promo?.code ?? null,
        }),
      });
      const data = (await res.json()) as { ok: boolean; url?: string; message?: string };
      if (!data.ok || !data.url) {
        setServerError(data.message ?? "Une erreur est survenue, réessaie.");
        setSubmitting(false);
        return;
      }
      if (data.url.startsWith("http")) window.location.href = data.url;
      else router.push(data.url);
    } catch {
      setServerError("Connexion impossible. Vérifie ton réseau et réessaie.");
      setSubmitting(false);
    }
  }

  if (!hydrated) return <div className="mt-10 h-96 animate-pulse rounded-xl bg-iron-900" />;

  if (items.length === 0 && !submitting) {
    return (
      <div className="mt-10 rounded-xl border border-dashed border-iron-700 px-6 py-16 text-center">
        <p className="display text-4xl font-extrabold">Ton panier est vide</p>
        <p className="mt-2 text-chalk-dim">Ajoute quelques accessoires avant de passer commande.</p>
        <Link href="/shop" className={`${btn.primary} mt-6`}>
          Aller à la boutique
        </Link>
      </div>
    );
  }

  const field = (k: keyof CheckoutInput, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={props.className}>
      <label htmlFor={`co-${k}`} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={`co-${k}`}
        name={k}
        value={values[k] ?? ""}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `co-${k}-err` : undefined}
        className={input}
        {...props}
      />
      {errors[k] && (
        <p id={`co-${k}-err`} className="mt-1 text-sm text-[#ff6b72]">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
      <form onSubmit={onSubmit} noValidate className="space-y-8" data-testid="checkout-form">
        {demo && (
          <p className="flex items-start gap-3 rounded-md border border-plate-blue/50 bg-plate-blue/10 p-4 text-sm" data-testid="demo-banner">
            <Info size={18} className="mt-0.5 shrink-0 text-plate-blue" />
            <span>
              <strong>Mode démo</strong> : aucune clé Stripe n&apos;est configurée. La commande sera enregistrée et marquée payée sans
              paiement réel.
            </span>
          </p>
        )}
        <fieldset className="space-y-4">
          <legend className="font-display text-2xl font-bold uppercase tracking-wide">Contact</legend>
          {field("email", "E-mail", { type: "email", autoComplete: "email", placeholder: "ton@email.fr" })}
          {field("phone", "Téléphone (facultatif, pour le livreur)", { type: "tel", autoComplete: "tel" })}
        </fieldset>
        <fieldset className="space-y-4">
          <legend className="font-display text-2xl font-bold uppercase tracking-wide">Livraison</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("firstName", "Prénom", { autoComplete: "given-name" })}
            {field("lastName", "Nom", { autoComplete: "family-name" })}
          </div>
          {field("address", "Adresse", { autoComplete: "address-line1" })}
          {field("address2", "Complément (facultatif)", { autoComplete: "address-line2" })}
          <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
            {field("postalCode", "Code postal", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 5 })}
            {field("city", "Ville", { autoComplete: "address-level2" })}
          </div>
          <div>
            <label htmlFor="co-country" className="mb-1.5 block text-sm font-medium">
              Pays
            </label>
            <select id="co-country" value={values.country} onChange={set("country")} className={input} autoComplete="country-name">
              <option>France</option>
              <option>Belgique</option>
              <option>Luxembourg</option>
              <option>Suisse</option>
            </select>
          </div>
        </fieldset>

        {serverError && (
          <p className="rounded-md border border-plate-red/50 bg-plate-red/10 p-3 text-sm" role="alert">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={submitting} className={`${btn.primary} w-full !py-4`} data-testid="place-order">
          <Lock size={18} />
          {submitting ? "Traitement…" : demo ? `Valider la commande · ${formatPrice(totals.total)}` : `Payer ${formatPrice(totals.total)}`}
        </button>
        <p className="flex items-center justify-center gap-2 text-sm text-chalk-dim">
          <ShieldCheck size={16} /> Paiement chiffré via Stripe · Retours gratuits sous 30 jours
        </p>
      </form>

      <aside className="h-fit rounded-xl border border-iron-800 bg-iron-900 p-6 lg:sticky lg:top-24" aria-label="Récapitulatif">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide">Récapitulatif</h2>
        <ul className="mt-5 space-y-4">
          {items.map((i) => (
            <li key={i.key} className="flex gap-3">
              <div className="relative shrink-0">
                <Image src={i.image} alt={i.name} width={64} height={64} className="rounded-md bg-iron-800" />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-iron-600 px-1 text-xs font-bold">
                  {i.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{i.name}</p>
                <p className="text-sm text-chalk-dim">{i.variantName}</p>
              </div>
              <p className="text-sm font-semibold">{formatPrice(i.unitPrice * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-4 border-t border-iron-800 pt-5">
          <FreeShippingBar remaining={totals.remainingForFreeShipping} />
          <PromoField />
        </div>
        <dl className="mt-5 space-y-1.5 border-t border-iron-800 pt-5 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-chalk-dim">Sous-total</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-plate-green">
              <dt>Réduction ({promo?.code})</dt>
              <dd>−{formatPrice(totals.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-chalk-dim">Livraison</dt>
            <dd>{totals.shipping === 0 ? "Offerte" : formatPrice(totals.shipping)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-lg font-bold">
            <dt>Total TTC</dt>
            <dd data-testid="checkout-total">{formatPrice(totals.total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
