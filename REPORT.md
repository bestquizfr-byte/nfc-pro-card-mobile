# REPORT — FERRUM, boutique d'accessoires de force

> **Forgé pour la charge.** Boutique e-commerce complète (Next.js 16 + Prisma + Stripe), en français, prête à tester en local.
> Le code est dans [`ferrum/`](ferrum/).

## 🚀 Lancer le site demain matin

```bash
cd ferrum
npm install          # installe les dépendances + génère le client Prisma
cp .env.example .env # (déjà fait si tu reprends ce conteneur)
npm run setup        # crée la base SQLite + la remplit (12 produits, 3 commandes démo, code FORCE10)
npm run dev          # http://localhost:3000
```

Version production locale : `npm run build && npm run start`.

| À tester | Où | Identifiants |
|---|---|---|
| Boutique | http://localhost:3000 | — |
| Catalogue + filtres + recherche | http://localhost:3000/shop | — |
| Fiche produit | http://localhost:3000/product/ceinture-levier-10mm | — |
| Code promo | dans le panier | `FORCE10` (−10 %) |
| Checkout (mode démo) | panier → « Passer commande » | aucun paiement réel sans clé Stripe |
| Dashboard admin | http://localhost:3000/admin | mot de passe `admin123` |

**Paiement réel (test Stripe)** : mets `STRIPE_SECRET_KEY=sk_test_…` dans `.env`, redémarre, paye avec la carte `4242 4242 4242 4242`.
Webhook en local : `stripe listen --forward-to localhost:3000/api/stripe/webhook` puis renseigne `STRIPE_WEBHOOK_SECRET`.

**Tests automatiques** : `npm run build && npm run start` puis, dans un autre terminal, `npm run test:e2e` (30 tests).
Remettre la base à zéro : `npm run db:reset`.

## 🧠 Skills & MCP trouvés sur GitHub (Phase 0)

- **Installés dans `.claude/skills/`** (officiels, copiés tels quels) : `frontend-design` et `webapp-testing`
  ([anthropics/skills](https://github.com/anthropics/skills), Apache-2.0) ; `vercel-react-best-practices`, `web-design-guidelines`,
  `deploy-to-vercel` ([vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills), MIT).
- **Synthétisés (maison)** : `ecommerce-conversion-fr`, `stripe-checkout-nextjs`, `nextjs-seo-ecommerce`, `ecommerce-qa-playwright`, `dropshipping-sourcing`.
- **`.mcp.json`** (racine du dépôt) : Playwright MCP, Context7, Stripe MCP, Fetch, shadcn, Prisma. Les clés viennent de
  l'environnement (`STRIPE_SECRET_KEY`, `CONTEXT7_API_KEY`), placeholders dans `ferrum/.env.example`.
- Détail et justification : [PROGRESS.md](PROGRESS.md).

## 🏷️ La marque

- **Nom** : FERRUM. **Slogan** : « Forgé pour la charge. »
- **Univers** : graphite chaud + craie, bande de couleurs des disques olympiques (rouge/bleu/jaune/vert/blanc) comme
  signature et code couleur des catégories. Typo Barlow Condensed / Barlow. Ton : tutoiement, direct, orienté performance.
- **Logo** : un disque rouge vu de face + wordmark condensé.

## 📦 Les produits (fournisseurs AliExpress réels, prix relevés le 25/11/2026)

| Produit | Prix d'achat | Prix de vente TTC | Prix barré | Marge brute HT* | Coef. |
|---|---:|---:|---:|---:|---:|
| [Ceinture à levier 10 mm Forge](https://fr.aliexpress.com/item/1005010406538066.html) | 36,39 € | 74,90 € | 94,90 € | 24,05 € (39 %) | ×2.1 |
| [Sangles Figure 8 Lockdown](https://fr.aliexpress.com/item/1005009751953275.html) | 4,79 € | 19,90 € | 24,90 € | 10,64 € (64 %) | ×4.2 |
| [Genouillères 7 mm Squat Armor](https://fr.aliexpress.com/item/1005007170210963.html) | 13,29 € | 44,90 € | 59,90 € | 22,60 € (60 %) | ×3.4 |
| [Bandes de poignets 60 cm Brace](https://fr.aliexpress.com/item/1005006270810351.html) | 4,89 € | 19,90 € | 24,90 € | 10,54 € (64 %) | ×4.1 |
| [Magnésie liquide Grip 100 ml](https://fr.aliexpress.com/item/1005010089097954.html) | 7,39 € | 14,90 € | 17,90 € | 3,95 € (32 %) | ×2.0 |
| [Crochets de tirage Hookgrip](https://fr.aliexpress.com/item/1005009806932185.html) | 16,19 € | 34,90 € | 44,90 € | 11,52 € (40 %) | ×2.2 |
| [Ceinture de lest Chain](https://fr.aliexpress.com/item/1005008248081389.html) | 14,49 € | 34,90 € | 44,90 € | 13,22 € (45 %) | ×2.4 |
| [Kit 5 bandes de traction](https://fr.aliexpress.com/item/1005012986658635.html) | 28,79 € | 54,90 € | 69,90 € | 15,29 € (33 %) | ×1.9 |
| [Gourde isotherme 2 L Hydra](https://fr.aliexpress.com/item/1005009984649541.html) | 20,19 € | 39,90 € | 49,90 € | 11,61 € (35 %) | ×2.0 |
| [Sac de sport 40 L Titan](https://fr.aliexpress.com/item/1005007011768355.html) | 19,19 € | 54,90 € | 69,90 € | 24,89 € (54 %) | ×2.9 |
| [Sangles lasso rembourrées](https://fr.aliexpress.com/item/1005007014464296.html) | 5,25 € | 14,90 € | 19,90 € | 6,09 € (49 %) | ×2.8 |
| [Pack Full PR](https://fr.aliexpress.com/item/1005010406538066.html) | 59,36 € | 129,90 € | 159,60 € | 46,09 € (43 %) | ×2.2 |

\* Marge brute HT après TVA 20 %, frais Stripe et emballage, **avant pub et retours**. Méthode et repères marché : [ferrum/SOURCING.md](ferrum/SOURCING.md).

**Lecture business** : les produits « cash » sont les sangles, bandes de poignets, genouillères et le sac (54–64 % de marge).
La ceinture à levier fait le prestige et le panier moyen, mais il faut négocier son prix en volume. Magnésie et kit bandes
servent de compléments pour franchir le seuil de 60 € de livraison offerte.

**Visuels** : 40 rendus studio originaux (un par coloris, la galerie change avec la variante) + 10 photos lifestyle Pexels,
tous servis en local (aucune image externe → aucun 404 possible, vérifié par les tests). Régénérables : `npm run images`.

## ✅ Fonctionnalités livrées

- **Accueil** : barre d'annonce défilante, hero plein écran, réassurance, best-sellers, bloc Pack Full PR, catégories, histoire, avis, newsletter (donne le code FORCE10).
- **/shop** : recherche instantanée (insensible aux accents), filtres catégorie / prix / stock, tri popularité / prix / note, état vide, filtres en tiroir sur mobile, URL partageable.
- **Fiche produit** : galerie, coloris et tailles (épuisés barrés), stock faible affiché, CTA collant mobile, « Souvent acheté ensemble » avec ajout groupé, accordéons (description, caractéristiques, guide des tailles, livraison, retours), avis avec distribution, JSON-LD Product.
- **Panier (drawer)** : barre de progression livraison offerte, quantités, suppression, code promo, persistance localStorage.
- **Checkout** : formulaire validé par Zod (client + serveur), recalcul serveur des prix et du stock, Stripe Checkout ou mode démo, page de confirmation avec numéro `FER-XXXXXX`.
- **Admin** : KPIs (CA TTC/HT, commandes, panier moyen, marge brute estimée, stock faible), CRUD produits avec éditeur de variantes, prix d'achat et lien fournisseur, commandes filtrables avec changement de statut (En attente, Payée, Expédiée, Livrée, Annulée).
- **SEO** : metadata dynamiques, canonical, Open Graph, `sitemap.xml`, `robots.txt` (admin/api/checkout exclus), `lang="fr"`.

## 🧪 QA

- `npm run build` : ✅ 0 erreur TypeScript · `npm run lint` : ✅ 0 erreur, 0 avertissement.
- **Playwright : 30/30 ✅** : toutes les pages (accueil, shop, 12 fiches produit, checkout, admin, infos) en 200 sans erreur
  console et avec toutes les images chargées ; recherche/filtres/tri ; parcours complet panier → FORCE10 (−3,98 € vérifié)
  → validation des erreurs → commande → confirmation → panier vidé → admin → statut « Expédiée » ; upsell groupé ;
  ajout rapide sur mobile ; CRUD produit complet ; SEO (sitemap, robots, JSON-LD, canonical).
- Captures relues en desktop (1440 px) et mobile (iPhone 13).

## ⚠️ À faire avant de vendre pour de vrai

1. **Commander un échantillon** de chaque produit et vérifier la qualité.
2. **Remplacer les avis de démonstration** par de vrais avis (Judge.me, Trustpilot…) : publier de faux avis est illégal.
3. **Prix barrés** : ils doivent correspondre au prix le plus bas des 30 derniers jours (règle française). Les ajuster ou les retirer au lancement.
4. **Logo FERRUM sur les produits** : les fournisseurs livrent avec leur logo. Demander la personnalisation (MOQ ~100–200) ou passer par un agent.
5. **Magnésie liquide** : produit inflammable, prévoir un stock ou un fournisseur en Europe.
6. Mentions légales, CGV, politique de confidentialité, e-mails transactionnels (Resend/Brevo), Stripe en mode live.
7. **Déploiement Vercel** : SQLite ne persiste pas sur Vercel. Passer `provider = "postgresql"` dans `ferrum/prisma/schema.prisma`,
   créer une base Neon/Vercel Postgres, définir `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, `NEXT_PUBLIC_SITE_URL`, Stripe,
   et choisir **Root Directory = `ferrum`** dans Vercel. Puis `npx prisma db push && npx prisma db seed` une fois.
