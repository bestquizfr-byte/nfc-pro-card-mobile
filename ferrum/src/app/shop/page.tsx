import type { Metadata } from "next";
import { getProducts, toCard } from "@/lib/products";
import { CATEGORIES } from "@/data/catalog";
import { ShopBrowser } from "@/components/shop/shop-browser";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: PageProps<"/shop">): Promise<Metadata> {
  const { categorie } = await searchParams;
  const cat = CATEGORIES.find((c) => c.slug === categorie);
  return {
    title: cat ? `${cat.name} — accessoires de musculation` : "Boutique — tous les accessoires de force",
    description: cat
      ? `${cat.blurb} Découvre la sélection ${cat.name} FERRUM. Livraison offerte dès 60 €.`
      : "Ceintures à levier, sangles, genouillères, magnésie, lest : tous les accessoires de musculation FERRUM. Livraison offerte dès 60 €.",
    alternates: { canonical: cat ? `/shop?categorie=${cat.slug}` : "/shop" },
  };
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sp = await searchParams;
  const products = (await getProducts()).map(toCard);
  const initial = {
    q: first(sp.q) ?? "",
    categorie: first(sp.categorie) ?? "",
    prix: first(sp.prix) ?? "",
    stock: first(sp.stock) === "1",
    tri: first(sp.tri) ?? "popularite",
    focus: first(sp.focus) === "1",
  };
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
      <ShopBrowser key={JSON.stringify(initial)} products={products} categories={CATEGORIES} initial={initial} />
    </div>
  );
}
