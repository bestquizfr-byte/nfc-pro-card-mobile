---
name: ecommerce-conversion-fr
description: Règles UX/CRO pour boutique D2C francophone (fiche produit, panier, checkout, preuve sociale, copy). À utiliser pour créer ou revoir toute page de la boutique FERRUM (accueil, /shop, /product, panier, checkout).
---

# Conversion e-commerce (FR)

Synthèse des pratiques Baymard Institute, Shopify Plus et marques D2C (Gymshark, SBD, YoungLA) adaptée au français.

## Fiche produit
- Au-dessus de la ligne de flottaison sur mobile : titre, note + nombre d'avis, prix (barré si promo, % économisé), sélecteur de variante, CTA.
- CTA « Ajouter au panier » collant en bas d'écran sur mobile dès que le CTA principal sort du viewport.
- Variantes : boutons (pas de `<select>`), variante épuisée barrée mais visible, stock faible affiché (« Plus que 4 en stock ») seulement si vrai (< 6).
- Bénéfices avant caractéristiques. 3 puces maximum au-dessus du pli.
- Accordéons : Description, Caractéristiques, Guide des tailles, Livraison, Retours. Le premier ouvert.
- Bloc « Souvent acheté ensemble » avec ajout groupé en 1 clic et remise affichée.
- Avis : distribution des notes, avis vérifiés, date, prénom + initiale.

## Panier (drawer)
- S'ouvre automatiquement après ajout. Barre de progression vers la livraison offerte (« Plus que 12,40 € pour la livraison offerte »).
- Quantité +/−, suppression, code promo repliable, sous-total, réduction, livraison, total TTC.
- État vide utile : CTA vers best-sellers.

## Checkout
- Invité par défaut (pas de création de compte obligatoire).
- Champs : email, prénom, nom, adresse, complément, code postal, ville, pays, téléphone (optionnel). Validation Zod côté client ET serveur, messages en français.
- Récapitulatif de commande visible (sticky desktop). Réassurance près du bouton payer.
- Recalculer TOUJOURS prix, remise et stock côté serveur. Ne jamais faire confiance au prix envoyé par le client.

## Copy
- Tutoiement, phrases courtes, verbes d'action. Prix au format `19,90 €` (Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })).
- Pas de faux compte à rebours ni de fausse rareté.

## Accessibilité
- Contraste AA minimum, focus visible, `aria-label` sur boutons icônes, `prefers-reduced-motion` respecté.
