---
name: dropshipping-sourcing
description: Méthode de sourcing produits (AliExpress/CJ) et calcul de prix de vente/marge pour FERRUM. À utiliser pour ajouter un produit au catalogue ou revoir les prix.
---

# Sourcing & pricing

Adapté du skill « dropshipping-product-research » (nexscope-ai/eCommerce-Skills, MIT).

## Choisir un fournisseur
- AliExpress trié par commandes : ≥ 500 ventes, note ≥ 4,7, livraison gratuite vers la France, variantes cohérentes.
- Commander un échantillon avant de lancer la pub. Vérifier coutures, odeur du néoprène, épaisseur réelle.
- Éviter les liquides inflammables en dropshipping long-courrier (magnésie liquide = alcool) : préférer un stock en France.

## Prix
- Coût de revient = prix fournisseur + frais Stripe (1,5 % + 0,25 €) + emballage/insert de marque (~0,60 €).
- Prix TTC cible ≈ 2,5 à 4 × coût fournisseur pour les accessoires < 15 €, 2 × pour les produits > 30 €.
- Marge brute HT = prix TTC / 1,2 − coût de revient. Viser ≥ 55 % pour financer l'acquisition (CAC).
- Toujours se positionner sous les marques premium (SBD, Rehband, Gymreapers) et au-dessus du no-name Amazon.
- Prix barré = prix de référence réellement pratiqué (obligation légale en France : plus bas prix des 30 jours précédents).

Les données de sourcing sont dans `ferrum/SOURCING.md` et dans les champs `supplierUrl`/`costPrice` des produits (admin).
