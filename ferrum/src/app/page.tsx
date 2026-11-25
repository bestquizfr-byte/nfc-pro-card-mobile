import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Reassurance } from "@/components/home/reassurance";
import { SectionHeading } from "@/components/home/section-heading";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { ProductCard } from "@/components/product/product-card";
import { Price } from "@/components/ui/price";
import { Stars } from "@/components/ui/stars";
import { btn } from "@/components/ui/button";
import { getLatestReviews, getProducts, toCard } from "@/lib/products";
import { CATEGORIES } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const CATEGORY_IMAGES: Record<string, string> = {
  maintien: "/images/products/ceinture-levier-noir.webp",
  grip: "/images/products/sangles-figure-8-rouge.webp",
  lest: "/images/products/ceinture-lest-noir.webp",
  equipement: "/images/products/sac-de-sport-kaki.webp",
};

export default async function HomePage() {
  const [products, reviews] = await Promise.all([getProducts(), getLatestReviews(3)]);
  const bestSellers = products.filter((p) => !p.isBundle).slice(0, 4);
  const pack = products.find((p) => p.isBundle);
  const packItems = pack ? products.filter((p) => pack.bundleItems.includes(p.slug)) : [];
  const allRatings = products.filter((p) => p.reviewCount > 0);
  const totalReviews = allRatings.reduce((s, p) => s + p.reviewCount, 0);
  const avg = allRatings.reduce((s, p) => s + p.rating * p.reviewCount, 0) / Math.max(1, totalReviews);
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]));

  return (
    <>
      <Hero />
      <Reassurance />

      {/* Best-sellers */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <SectionHeading
          title="Best-sellers"
          sub="Les accessoires que nos clients rachètent pour leurs partenaires d'entraînement."
          href="/shop"
          cta="Tout voir"
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.id} product={toCard(p)} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* Pack */}
      {pack && (
        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center overflow-hidden rounded-xl border border-iron-800 bg-iron-900 lg:grid-cols-2">
            <div className="relative aspect-square">
              <Image src={pack.images[0]} alt={pack.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
              <p className="text-sm font-semibold text-plate-yellow">Pack · tu économises {formatPrice((pack.compareAtPrice ?? 0) - pack.price)}</p>
              <h2 className="display mt-3 text-6xl font-extrabold sm:text-7xl">Full PR</h2>
              <p className="mt-4 max-w-md text-lg text-chalk/85">{pack.tagline}</p>
              <ul className="mt-6 space-y-2.5">
                {packItems.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <Check size={18} className="shrink-0 text-plate-green" />
                    <span>{p.name}</span>
                    <span className="ml-auto text-sm text-iron-400 line-through">{formatPrice(p.price)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Price price={pack.price} compareAt={pack.compareAtPrice} size="lg" />
                <Link href={`/product/${pack.slug}`} className={btn.primary}>
                  Composer mon pack
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Catégories */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Par objectif" sub="Chaque famille a sa couleur, comme les disques sur ta barre." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORIES.filter((c) => c.slug !== "packs").map((c) => (
            <Link
              key={c.slug}
              href={`/shop?categorie=${c.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg bg-iron-900 p-5"
            >
              <Image
                src={CATEGORY_IMAGES[c.slug]}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover object-[50%_20%] transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-iron-950 from-20% via-iron-950/75 via-45% to-transparent to-75%" />
              <span className="absolute left-0 top-0 h-full w-1.5" style={{ background: c.plate }} />
              <div className="relative">
                <h3 className="display text-3xl font-extrabold sm:text-4xl">{c.name}</h3>
                <p className="mt-1 hidden text-sm text-chalk/80 sm:block">{c.blurb}</p>
                <p className="mt-2 text-sm font-semibold text-chalk-dim">{counts[c.slug]} produits</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Histoire */}
      <section className="relative mt-24 overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl lg:aspect-[5/6]">
            <Image
              src="/images/lifestyle/athlete-focus.webp"
              alt="Athlète concentré pendant une série lourde"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="display text-5xl font-extrabold sm:text-6xl">Testé sous la barre, pas en réunion.</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-chalk/85">
              <p>
                FERRUM est né dans une salle de force, entre deux séries de soulevé de terre. On voulait du matériel solide sans payer
                le logo d&apos;une grande marque.
              </p>
              <p>
                Chaque accessoire est choisi pour une chose : t&apos;aider à soulever plus lourd, plus longtemps. Cuir 10 mm, néoprène
                7 mm, coutures renforcées. Si ça ne tient pas, on ne le vend pas.
              </p>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-iron-800 pt-8">
              <div>
                <dt className="text-sm text-chalk-dim">Note moyenne</dt>
                <dd className="display mt-1 text-4xl font-extrabold">{avg.toFixed(1)}/5</dd>
              </div>
              <div>
                <dt className="text-sm text-chalk-dim">Retours</dt>
                <dd className="display mt-1 text-4xl font-extrabold">30 j</dd>
              </div>
              <div>
                <dt className="text-sm text-chalk-dim">Garantie</dt>
                <dd className="display mt-1 text-4xl font-extrabold">2 ans</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Avis */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="display text-5xl font-extrabold sm:text-6xl">Ils ont battu leur record</h2>
          <div className="flex items-center gap-3">
            <Stars rating={avg} size={18} />
            <span className="text-chalk-dim">
              {avg.toFixed(1)}/5 · {totalReviews} avis vérifiés
            </span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.id} className="flex flex-col rounded-lg border border-iron-800 bg-iron-900 p-6">
              <Stars rating={r.rating} size={15} />
              <blockquote className="mt-4 flex-1">
                <p className="font-semibold">{r.title}</p>
                <p className="mt-2 leading-relaxed text-chalk/80">{r.body}</p>
              </blockquote>
              <figcaption className="mt-5 border-t border-iron-800 pt-4 text-sm">
                <span className="font-semibold">{r.author}</span>
                <span className="text-chalk-dim"> · {r.city} · </span>
                <Link href={`/product/${r.product.slug}`} className="text-chalk-dim underline-offset-4 hover:text-chalk hover:underline">
                  {r.product.name}
                </Link>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-xl border border-iron-800 px-6 py-14 sm:px-12">
          <Image src="/images/lifestyle/barbell-mist.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-70" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-iron-950 via-iron-950/80 to-iron-950/10" />
          <div className="max-w-xl">
            <h2 className="display text-5xl font-extrabold sm:text-6xl">−10 % sur ta première commande</h2>
            <p className="mt-4 text-lg text-chalk/85">
              Inscris-toi : programmes de force, nouveautés en avant-première et ventes privées. Ton code arrive tout de suite.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
