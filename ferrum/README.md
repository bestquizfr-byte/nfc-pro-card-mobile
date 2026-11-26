# FERRUM — boutique d'accessoires de force

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Prisma 6 (SQLite) · Zustand · Zod · Framer Motion · Stripe.

```bash
npm install
cp .env.example .env
npm run setup   # base SQLite + seed
npm run dev     # http://localhost:3000  — admin : /admin (mot de passe admin123)
```

| Script | Rôle |
|---|---|
| `npm run dev` / `build` / `start` | développement / build de prod / serveur de prod |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm run setup` · `db:reset` | crée et remplit la base · remet à zéro |
| `npm run test:e2e` | tests Playwright (serveur lancé sur :3000) |
| `npm run images` | régénère les visuels produits (`scripts/render-product-images.mjs`) |

Sans `STRIPE_SECRET_KEY`, le checkout fonctionne en **mode démo** (commande enregistrée, aucun paiement).

Structure : `src/app` (routes), `src/components`, `src/lib` (prisma, panier, prix, auth admin, commandes),
`src/data/catalog.ts` (catalogue + sourcing, utilisé par `prisma/seed.ts`), `e2e/` (tests), `SOURCING.md` (fournisseurs & marges).

Rapport complet : [`../REPORT.md`](../REPORT.md) · Décisions : [`../DECISIONS.md`](../DECISIONS.md).
