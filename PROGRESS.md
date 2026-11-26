# PROGRESS — FERRUM

| Phase | Statut | Détail |
|---|---|---|
| 0. Skills & MCP | ✅ | 10 skills dans `.claude/skills/`, `.mcp.json` (6 serveurs), placeholders dans `ferrum/.env.example` |
| 1. Marque & produits | ✅ | Marque FERRUM, 11 produits sourcés AliExpress + 1 pack, prix/marges, 55 variantes, 40 avis |
| 1b. Visuels | ✅ | 40 rendus produits originaux (1 par coloris + vue claire) + 10 photos lifestyle Pexels locales |
| 2. Stack | ✅ | Next.js 16.4 App Router, TS strict, Tailwind v4, Prisma 6 + SQLite, Zustand persist, Zod, Framer Motion, Stripe |
| 3. Développement | ✅ | Accueil, /shop, /product/[slug], drawer panier, checkout, confirmation, admin (KPIs, CRUD, commandes), SEO |
| 4. QA | ✅ | `npm run build` OK (0 erreur TS), `npm run lint` OK (0 erreur, 0 warning), **30/30 tests Playwright** |

## Phase 0 — Recherche GitHub (skills & connecteurs)

Recherche via l'API GitHub (`gh api search/repositories`) :

| Dépôt | ★ | Retenu ? |
|---|---|---|
| anthropics/skills | officiel | ✅ `frontend-design`, `webapp-testing` copiés (Apache-2.0) |
| vercel-labs/agent-skills | officiel | ✅ `vercel-react-best-practices` (70 règles), `web-design-guidelines`, `deploy-to-vercel` (MIT) |
| ComposioHQ/awesome-claude-skills | 80k | 📖 lu comme index, rien installé (skills non audités) |
| hesreallyhim/awesome-claude-code | 59k | 📖 index |
| microsoft/playwright-mcp | 40k | ✅ dans `.mcp.json` |
| upstash/context7 | 65k | ✅ dans `.mcp.json` (docs à jour Next/Prisma/Stripe) |
| stripe (`@stripe/mcp`) | officiel | ✅ dans `.mcp.json` (clé via `STRIPE_SECRET_KEY`) |
| shadcn MCP, Prisma MCP, mcp-server-fetch | officiels | ✅ dans `.mcp.json` |

Skills maison synthétisés (`.claude/skills/`) : `ecommerce-conversion-fr` (règles Baymard/CRO en FR), `stripe-checkout-nextjs`
(checkout + mode démo), `nextjs-seo-ecommerce`, `ecommerce-qa-playwright`, `dropshipping-sourcing` (méthode de prix/marge).

**Comment ils ont été appliqués** : direction artistique choisie selon `frontend-design` (motif unique « disques », pas
de dégradés décoratifs ni d'eyebrows en capitales) ; `vercel-react-best-practices` (Promise.all côté serveur, `React.cache`,
DTO publics sans prix d'achat, pas de composants définis dans des composants — un bug de perte de focus corrigé grâce à ça) ;
`ecommerce-conversion-fr` (CTA collant mobile, barre livraison offerte, variantes en boutons, recalcul serveur) ;
`webapp-testing` + `ecommerce-qa-playwright` pour la boucle QA.

## Journal
- Réseau : AliExpress/Pexels bloqués par défaut → environnement cloud dédié créé avec ces hôtes autorisés.
- Pages produit AliExpress protégées par captcha → extraction depuis les pages de recherche (titre, prix €, ventes, note, image).
- Photos fournisseurs écartées (logos tiers) → générateur de rendus studio.
- Bugs corrigés en QA : serveur zombie servant un ancien build (500), formulaire admin qui perdait le focus et le message
  de succès, sélecteurs de test ambigus (e-mail newsletter vs checkout), upsell qui proposait la taille XS par défaut.
