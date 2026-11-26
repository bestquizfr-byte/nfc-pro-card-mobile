---
name: ecommerce-qa-playwright
description: Boucle QA e2e pour la boutique (pages 200, erreurs console, panier, code promo, checkout démo, admin). À utiliser avant de déclarer une tâche terminée.
---

# QA e-commerce

Complète le skill `webapp-testing` (Anthropic).

1. `npm run build` doit passer sans erreur TypeScript ni ESLint (`npm run lint`).
2. Démarrer `npm run start` puis `npm run test:e2e` (Playwright, `--trace off`).
3. Vérifier : `/`, `/shop`, `/product/<slug>`, `/admin` → 200 et aucune erreur console ; toutes les images (`img.naturalWidth > 0`).
4. Parcours : ajout panier → drawer → code `FORCE10` (-10 %) → checkout (formulaire Zod) → page de confirmation avec numéro de commande → commande visible dans l'admin, changement de statut.
5. Captures mobile (390px) et desktop (1440px) des pages clés, les regarder et corriger le polish.
