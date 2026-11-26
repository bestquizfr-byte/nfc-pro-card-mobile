---
name: nextjs-seo-ecommerce
description: SEO technique Next.js App Router pour e-commerce (metadata, generateMetadata, sitemap.ts, robots.ts, JSON-LD Product, Open Graph). À utiliser pour toute page publique de la boutique.
---

# SEO e-commerce Next.js

- `metadataBase` défini dans le layout racine depuis `NEXT_PUBLIC_SITE_URL`.
- `title.template` : `%s | FERRUM`. Description unique par page (150–160 caractères).
- Fiche produit : `generateMetadata` (titre, description, `alternates.canonical`, openGraph image produit) + JSON-LD `Product` avec `offers` (price, priceCurrency EUR, availability) et `aggregateRating`.
- `app/sitemap.ts` : pages statiques + toutes les fiches produits (lastModified = updatedAt). `app/robots.ts` : interdire `/admin`, `/api`, `/checkout`.
- Images : `next/image` avec `sizes` corrects, `priority` uniquement sur l'image LCP (hero, image principale produit).
- Un seul `<h1>` par page, hiérarchie de titres logique, `lang="fr"`.
- Pages admin : `robots: { index: false }`.
