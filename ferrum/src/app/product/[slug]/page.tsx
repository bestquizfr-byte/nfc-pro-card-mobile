import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getProducts, getReviews, toCard } from "@/lib/products";
import { CATEGORIES } from "@/data/catalog";
import { ProductView } from "@/components/product/product-view";
import { FrequentlyBought } from "@/components/product/frequently-bought";
import { Reviews } from "@/components/product/reviews";
import { ProductCard } from "@/components/product/product-card";
import { siteUrl } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Produit introuvable" };
  const description = `${p.tagline} ${p.benefits[0] ?? ""}. Livraison offerte dès 60 €, retours 30 jours.`.slice(0, 160);
  return {
    title: p.name,
    description,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: `${p.name} | FERRUM`, description, images: [{ url: p.images[0], width: 1200, height: 1200, alt: p.name }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProductBySlug(slug), getProducts()]);
  if (!product) notFound();
  const reviews = await getReviews(product.id);
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const upsells = product.upsells.map((s) => bySlug.get(s)).filter((p): p is NonNullable<typeof p> => !!p && p.totalStock > 0);
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const fill = related.length < 4 ? all.filter((p) => p.id !== product.id && !related.includes(p)).slice(0, 4 - related.length) : [];
  const category = CATEGORIES.find((c) => c.slug === product.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => `${siteUrl()}${i}`),
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: "FERRUM" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl()}/product/${product.slug}`,
      priceCurrency: "EUR",
      price: (product.price / 100).toFixed(2),
      availability: product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center gap-1.5 text-sm text-chalk-dim">
        <Link href="/" className="hover:text-chalk">
          Accueil
        </Link>
        <ChevronRight size={14} />
        <Link href={`/shop?categorie=${product.category}`} className="hover:text-chalk">
          {category?.name ?? "Boutique"}
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-chalk" aria-current="page">
          {product.name}
        </span>
      </nav>

      <ProductView product={product} />

      {upsells.length > 0 && (
        <div className="mt-20">
          <FrequentlyBought main={product} others={upsells} />
        </div>
      )}

      <div className="mt-20">
        <Reviews reviews={reviews} rating={product.rating} />
      </div>

      <section className="mt-20" aria-labelledby="related-title">
        <h2 id="related-title" className="display mb-8 text-5xl font-extrabold">
          Complète ton setup
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {[...related, ...fill].map((p) => (
            <ProductCard key={p.id} product={toCard(p)} />
          ))}
        </div>
      </section>
    </div>
  );
}
