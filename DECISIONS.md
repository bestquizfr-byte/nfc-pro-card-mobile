# DECISIONS — FERRUM

Décisions prises en autonomie, avec leur justification.

## Produit & marque
- **Marque : FERRUM** (« fer » en latin), slogan **« Forgé pour la charge. »** Court, prononçable en français, évoque la fonte et la force.
- **Direction artistique : graphite chaud (#141518) + craie (#EDEAE3)**, pas de noir pur. Motif signature : la
  **bande « disques olympiques »** (rouge 25 kg, bleu 20, jaune 15, vert 10, blanc) sous le header et le footer, reprise
  pour coder les catégories (Maintien = rouge, Grip = bleu, Lest = jaune, Équipement = vert). Typo **Barlow Condensed**
  (titres, esprit signalétique industrielle) + **Barlow** (texte).
- **Tutoiement** partout : c'est le registre des marques fitness D2C en France.
- **12 produits** : 11 produits sourcés + 1 bundle (Pack Full PR, −19 %). La liste suit la demande (sangles, ceinture
  levier, poignets, gourde, sac, genouillères, magnésie, bundle) complétée par 3 best-sellers AliExpress du segment
  (crochets de tirage, ceinture de lest, kit bandes de traction).
- **Gourde 2 L au lieu de 1,5 L** : la 2 L à repères horaires est le format qui se vend dans la niche gym (le 1,5 L inox trouvé coûtait 30 €).

## Sourcing & prix
- **Fournisseurs = vrais listings AliExpress**, relevés via le moteur de recherche AliExpress (les pages produit sont
  protégées par captcha, les pages de recherche non). Liens, coût, nb de ventes et note dans `ferrum/SOURCING.md` et
  dans l'admin (colonne Fournisseur + marge).
- **Prix de vente** fixés entre les marques premium (SBD/Rehband/Gymreapers) et le no-name, à partir de prix relevés en France.
  Magnésie et kit bandes remontés après calcul de marge (22 % → 32 %, 27 % → 33 %).
- ⚠️ **Prix barrés** : ce sont des prix de référence de lancement. En France (art. L112-1-1 Code conso), le prix barré doit
  être le prix le plus bas pratiqué dans les 30 jours précédents : **à ajuster avant la mise en ligne réelle**.
- **Livraison** : offerte dès 60 €, sinon 4,90 €. Seuil choisi pour pousser le panier à 2 produits (panier moyen cible ≈ 65 €).
- Code **FORCE10** = −10 % sur le sous-total, la livraison offerte est évaluée après remise.

## Visuels
- **Pas de photos fournisseurs sur le site** : elles portent les logos d'autres marques (SKDK, AOLIKES, SPTP, STARMAP)
  et du texte en anglais → incompatibles avec une marque propre et juridiquement fragiles.
- **Rendus studio originaux** générés par code (`ferrum/scripts/render-product-images.mjs` : SVG paramétriques →
  Chromium → WebP), un rendu **par coloris** (la galerie change avec la variante) + une vue fond clair par produit.
- **Photos lifestyle Pexels** (licence libre usage commercial) téléchargées et servies localement → aucun lien externe
  qui pourrait casser (pas de 404 possible).

## Technique
- **Dossier `ferrum/`** : le dépôt contient déjà l'app « Vmax » ; la boutique vit à côté sans y toucher.
  `.claude/skills/` et `.mcp.json` sont à la racine pour que Claude Code les charge depuis le dépôt.
- **Next.js 16.4 (App Router) + TypeScript strict + Tailwind v4.** Le template active `cacheComponents` ; je l'ai **désactivé**
  et utilisé le modèle classique (`dynamic = "force-dynamic"` sur les pages qui lisent la base). Plus simple et fiable pour
  un catalogue SQLite modifié depuis l'admin, sans gestion de tags de cache.
- **Prisma 6.19 (pas 7)** : Prisma 7 impose des adaptateurs de driver et un `prisma.config.ts` ; la v6 fonctionne avec SQLite
  sans configuration et se migre vers PostgreSQL en changeant une ligne.
- **Montants en centimes (Int)** partout. Le serveur **recalcule prix, remise, livraison et stock** à la commande.
- **Stripe Checkout hébergé** si `STRIPE_SECRET_KEY` est défini ; sinon **mode démo** : commande créée puis marquée payée,
  stock décrémenté, bandeau « Mode démo » visible. Le webhook et le retour `success` (vérification de session) sont idempotents.
- **Admin** : mot de passe `ADMIN_PASSWORD` (défaut `admin123`), cookie httpOnly signé HMAC (12 h), vérifié dans le layout
  **et** dans chaque Server Action. Pas de lib d'auth : surdimensionné pour un seul compte.
- **shadcn/ui non utilisé** : composants custom Tailwind (moins de dépendances, design plus spécifique).
- **Avis clients** : avis de démonstration rédigés pour le prototype. ⚠️ **À remplacer par de vrais avis avant le lancement**
  (publier de faux avis est une pratique commerciale trompeuse en France).
- **Playwright épinglé en 1.63.0** pour utiliser le Chromium préinstallé de l'environnement.
- Formulaire admin : soumission manuelle (`startTransition`) pour éviter la réinitialisation automatique des champs par React 19
  quand la validation échoue.

## Ce que je n'ai pas fait (volontairement)
- Envoi d'e-mails transactionnels (pas de fournisseur SMTP) : le texte de confirmation l'annonce, à brancher (Resend, Brevo).
- Comptes clients : checkout invité uniquement (meilleure conversion).
- Skills communautaires (listes « awesome-claude-skills », 1 000+ skills) non installés : non audités. Seuls les skills officiels Anthropic et Vercel ont été copiés tels quels, le reste est synthétisé en skills maison.
