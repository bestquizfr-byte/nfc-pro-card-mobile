"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { FormState } from "@/app/admin/actions";
import { btn, input } from "@/components/ui/button";
import { CATEGORIES } from "@/data/catalog";

export type ProductFormValues = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  price: string;
  compareAtPrice: string;
  costPrice: string;
  supplierName: string;
  supplierUrl: string;
  images: string;
  benefits: string;
  badge: string;
  featured: boolean;
  active: boolean;
  variants: VariantRow[];
};

type VariantRow = { id?: string; name: string; color: string; colorHex: string; size: string; stock: string; price: string; image: string };

const emptyVariant: VariantRow = { name: "", color: "", colorHex: "", size: "", stock: "0", price: "", image: "" };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function Field({ label, name, error, hint, children }: { label: string; name: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`pf-${name}`} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-chalk-dim">{hint}</p>}
      {error && <p className="mt-1 text-sm text-[#ff6b72]">{error}</p>}
    </div>
  );
}

export function ProductForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial: ProductFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false, message: "" });
  const [variants, setVariants] = useState<VariantRow[]>(initial.variants.length ? initial.variants : [emptyVariant]);
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!!initial.slug);
  const [price, setPrice] = useState(initial.price);
  const [cost, setCost] = useState(initial.costPrice);
  const err = (k: string) => state.fieldErrors?.[k]?.[0];

  const ht = Number(price) / 1.2;
  const margin = ht > 0 && cost !== "" ? Math.round(((ht - Number(cost)) / ht) * 100) : null;

  const updateVariant = (i: number, k: keyof VariantRow, v: string) =>
    setVariants((all) => all.map((row, j) => (j === i ? { ...row, [k]: v } : row)));

  return (
    <form
      onSubmit={(e) => {
        // Soumission manuelle : évite la réinitialisation auto des champs par React 19 en cas d'erreur.
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
      className="mt-8 space-y-8"
      data-testid="product-form"
    >
      <section className="grid gap-5 rounded-xl border border-iron-800 bg-iron-900 p-5 sm:grid-cols-2">
        <h2 className="font-display text-xl font-bold uppercase sm:col-span-2">Infos produit</h2>
        <Field label="Nom" name="name" error={err("name")}>
          <input
            id="pf-name"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={input}
            required
          />
        </Field>
        <Field label="Slug (URL)" name="slug" error={err("slug")}>
          <input
            id="pf-slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className={input}
            required
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Accroche" name="tagline" error={err("tagline")}>
            <input id="pf-tagline" name="tagline" defaultValue={initial.tagline} className={input} required />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Description" name="description" error={err("description")}>
            <textarea id="pf-description" name="description" defaultValue={initial.description} rows={5} className={input} required />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Bénéfices (un par ligne)" name="benefits" error={err("benefits")}>
            <textarea id="pf-benefits" name="benefits" defaultValue={initial.benefits} rows={3} className={input} />
          </Field>
        </div>
        <Field label="Catégorie" name="category" error={err("category")}>
          <select id="pf-category" name="category" defaultValue={initial.category} className={input}>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Badge (facultatif)" name="badge" error={err("badge")} hint="Ex. Best-seller, Nouveau, −19 %">
          <input id="pf-badge" name="badge" defaultValue={initial.badge} className={input} />
        </Field>
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={initial.active} className="h-4 w-4 accent-plate-red" /> Visible sur la boutique
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={initial.featured} className="h-4 w-4 accent-plate-red" /> Mis en avant
          </label>
        </div>
      </section>

      <section className="grid gap-5 rounded-xl border border-iron-800 bg-iron-900 p-5 sm:grid-cols-3">
        <h2 className="font-display text-xl font-bold uppercase sm:col-span-3">Prix & sourcing</h2>
        <Field label="Prix de vente TTC (€)" name="price" error={err("price")}>
          <input id="pf-price" name="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={input} required />
        </Field>
        <Field label="Prix barré TTC (€)" name="compareAtPrice" error={err("compareAtPrice")} hint="Doit être un prix réellement pratiqué">
          <input id="pf-compareAtPrice" name="compareAtPrice" type="number" step="0.01" min="0" defaultValue={initial.compareAtPrice} className={input} />
        </Field>
        <Field label="Prix d'achat (€)" name="costPrice" error={err("costPrice")} hint={margin !== null ? `Marge brute HT : ${margin} %` : undefined}>
          <input id="pf-costPrice" name="costPrice" type="number" step="0.01" min="0" value={cost} onChange={(e) => setCost(e.target.value)} className={input} required />
        </Field>
        <Field label="Fournisseur" name="supplierName" error={err("supplierName")}>
          <input id="pf-supplierName" name="supplierName" defaultValue={initial.supplierName} className={input} required />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Lien fournisseur" name="supplierUrl" error={err("supplierUrl")}>
            <input id="pf-supplierUrl" name="supplierUrl" type="url" defaultValue={initial.supplierUrl} className={input} required />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label="Images (une URL ou un chemin par ligne, la 1re est l'image principale)" name="images" error={err("images")}>
            <textarea id="pf-images" name="images" defaultValue={initial.images} rows={3} className={`${input} font-mono text-sm`} required />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-iron-800 bg-iron-900 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold uppercase">Variantes & stock</h2>
          <button type="button" onClick={() => setVariants((v) => [...v, emptyVariant])} className={btn.ghost}>
            <Plus size={16} /> Ajouter une variante
          </button>
        </div>
        <input type="hidden" name="variants" value={JSON.stringify(variants)} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-chalk-dim">
              <tr>
                <th className="pb-2 pr-2 font-medium">Nom affiché</th>
                <th className="pb-2 pr-2 font-medium">Couleur</th>
                <th className="pb-2 pr-2 font-medium">Hex</th>
                <th className="pb-2 pr-2 font-medium">Taille / format</th>
                <th className="pb-2 pr-2 font-medium">Stock</th>
                <th className="pb-2 pr-2 font-medium">Prix spécifique €</th>
                <th className="pb-2 pr-2 font-medium">Image</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {variants.map((v, i) => (
                <tr key={i}>
                  {(["name", "color", "colorHex", "size", "stock", "price", "image"] as const).map((k) => (
                    <td key={k} className="py-1 pr-2">
                      <input
                        value={v[k]}
                        onChange={(e) => updateVariant(i, k, e.target.value)}
                        type={k === "stock" || k === "price" ? "number" : "text"}
                        step={k === "price" ? "0.01" : undefined}
                        placeholder={k === "colorHex" ? "#24252a" : k === "name" ? "Noir / M" : ""}
                        aria-label={`Variante ${i + 1} : ${k}`}
                        className={`${input} !px-2 !py-2 text-sm`}
                        data-testid={`variant-${i}-${k}`}
                      />
                    </td>
                  ))}
                  <td className="py-1">
                    <button
                      type="button"
                      onClick={() => setVariants((all) => all.filter((_, j) => j !== i))}
                      disabled={variants.length === 1}
                      className="rounded p-2 text-chalk-dim hover:text-[#ff6b72] disabled:opacity-30"
                      aria-label={`Supprimer la variante ${i + 1}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {state.message && (
        <p
          className={`rounded-md border p-3 text-sm ${state.ok ? "border-plate-green/40 bg-plate-green/10" : "border-plate-red/50 bg-plate-red/10"}`}
          role={state.ok ? "status" : "alert"}
          data-testid="form-message"
        >
          {state.message}
        </p>
      )}
      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={btn.primary} data-testid="save-product">
          {pending ? "Enregistrement…" : submitLabel}
        </button>
        <Link href="/admin/products" className={btn.secondary}>
          Annuler
        </Link>
      </div>
    </form>
  );
}
