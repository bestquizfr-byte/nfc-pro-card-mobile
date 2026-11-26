"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ProductCardDTO } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { input } from "@/components/ui/button";
import { cn } from "@/lib/format";

type Category = { slug: string; name: string; plate: string };
type Initial = { q: string; categorie: string; prix: string; stock: boolean; tri: string; focus: boolean };

const PRICE_RANGES = [
  { id: "", label: "Tous les prix" },
  { id: "0-20", label: "Moins de 20 €", min: 0, max: 2000 },
  { id: "20-50", label: "20 € – 50 €", min: 2000, max: 5000 },
  { id: "50+", label: "Plus de 50 €", min: 5000, max: Infinity },
];

const SORTS = [
  { id: "popularite", label: "Popularité" },
  { id: "prix-asc", label: "Prix croissant" },
  { id: "prix-desc", label: "Prix décroissant" },
  { id: "note", label: "Mieux notés" },
];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function ShopBrowser({
  products,
  categories,
  initial,
}: {
  products: ProductCardDTO[];
  categories: Category[];
  initial: Initial;
}) {
  const [q, setQ] = useState(initial.q);
  const [cat, setCat] = useState(initial.categorie);
  const [price, setPrice] = useState(initial.prix);
  const [inStock, setInStock] = useState(initial.stock);
  const [sort, setSort] = useState(initial.tri);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const deferredQ = useDeferredValue(q);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial.focus) searchRef.current?.focus();
  }, [initial.focus]);

  // Synchronise l'URL (partage / retour arrière) sans recharger la page.
  useEffect(() => {
    const params = new URLSearchParams();
    if (deferredQ) params.set("q", deferredQ);
    if (cat) params.set("categorie", cat);
    if (price) params.set("prix", price);
    if (inStock) params.set("stock", "1");
    if (sort !== "popularite") params.set("tri", sort);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/shop?${qs}` : "/shop");
  }, [deferredQ, cat, price, inStock, sort]);

  const results = useMemo(() => {
    const terms = normalize(deferredQ).split(/\s+/).filter(Boolean);
    const range = PRICE_RANGES.find((r) => r.id === price);
    const list = products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (inStock && p.totalStock === 0) return false;
      if (range && "min" in range && (p.price < range.min! || p.price >= range.max!)) return false;
      if (terms.length) {
        const hay = normalize(`${p.name} ${p.tagline} ${p.category}`);
        return terms.every((t) => hay.includes(t));
      }
      return true;
    });
    const sorters: Record<string, (a: ProductCardDTO, b: ProductCardDTO) => number> = {
      popularite: (a, b) => b.popularity - a.popularity,
      "prix-asc": (a, b) => a.price - b.price,
      "prix-desc": (a, b) => b.price - a.price,
      note: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
    };
    return list.toSorted(sorters[sort] ?? sorters.popularite);
  }, [products, deferredQ, cat, price, inStock, sort]);

  const activeCat = categories.find((c) => c.slug === cat);
  const activeFilters = (price ? 1 : 0) + (inStock ? 1 : 0);
  const reset = () => {
    setQ("");
    setCat("");
    setPrice("");
    setInStock(false);
  };

  const filterPanel = (
    <div className="space-y-8">
      <fieldset>
        <legend className="font-display text-lg font-bold uppercase tracking-wider">Prix</legend>
        <div className="mt-3 space-y-2">
          {PRICE_RANGES.map((r) => (
            <label key={r.id} className="flex cursor-pointer items-center gap-3 text-[15px]">
              <input
                type="radio"
                name="prix"
                checked={price === r.id}
                onChange={() => setPrice(r.id)}
                className="h-4 w-4 accent-plate-red"
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-display text-lg font-bold uppercase tracking-wider">Disponibilité</legend>
        <label className="mt-3 flex cursor-pointer items-center gap-3 text-[15px]">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="h-4 w-4 accent-plate-red"
            data-testid="filter-in-stock"
          />
          En stock uniquement
        </label>
      </fieldset>
    </div>
  );

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="display text-6xl font-extrabold sm:text-7xl">{activeCat ? activeCat.name : "Boutique"}</h1>
          <p className="mt-2 text-chalk-dim">
            {results.length} produit{results.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative w-full lg:max-w-sm">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-iron-400" />
          <label htmlFor="shop-search" className="sr-only">
            Rechercher un produit
          </label>
          <input
            id="shop-search"
            ref={searchRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher : ceinture, sangles, magnésie…"
            className={`${input} pl-10`}
            data-testid="shop-search"
          />
        </div>
      </div>

      {/* Catégories */}
      <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Catégories">
        <button
          type="button"
          onClick={() => setCat("")}
          aria-pressed={!cat}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
            !cat ? "border-chalk bg-chalk text-iron-950" : "border-iron-700 text-chalk-dim hover:border-chalk/50 hover:text-chalk",
          )}
        >
          Tout
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCat(cat === c.slug ? "" : c.slug)}
            aria-pressed={cat === c.slug}
            data-testid={`cat-${c.slug}`}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
              cat === c.slug ? "border-chalk bg-chalk text-iron-950" : "border-iron-700 text-chalk-dim hover:border-chalk/50 hover:text-chalk",
            )}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.plate }} />
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-y border-iron-800 py-3">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold lg:hidden"
        >
          <SlidersHorizontal size={17} /> Filtres {activeFilters > 0 && `(${activeFilters})`}
        </button>
        <p className="hidden text-sm text-chalk-dim lg:block">Filtrer et trier</p>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-chalk-dim">Trier par</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border border-iron-700 bg-iron-900 px-3 py-2 font-semibold text-chalk focus:border-chalk/60 focus:outline-none"
            data-testid="shop-sort"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{filterPanel}</aside>
        <div>
          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-iron-700 px-6 py-16 text-center">
              <p className="display text-3xl font-extrabold">Aucun résultat</p>
              <p className="mt-2 text-chalk-dim">Essaie un autre mot-clé ou retire un filtre.</p>
              <button type="button" onClick={reset} className="mt-6 text-sm font-semibold underline underline-offset-4">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3" data-testid="shop-results">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-2xl bg-iron-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="display text-3xl font-extrabold">Filtres</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} className="p-2" aria-label="Fermer les filtres">
                <X size={22} />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-8 w-full rounded-md bg-chalk py-3.5 font-display text-lg font-bold uppercase tracking-wider text-iron-950"
            >
              Voir {results.length} produit{results.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
