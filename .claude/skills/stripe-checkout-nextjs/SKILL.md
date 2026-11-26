---
name: stripe-checkout-nextjs
description: Intégrer Stripe Checkout (hosted) dans Next.js App Router avec un mode démo sans clé. À utiliser pour tout travail sur le paiement, les webhooks ou la création de commande.
---

# Stripe Checkout + Next.js App Router

Basé sur la doc officielle Stripe (Checkout Sessions, webhooks) et stripe/ai.

## Règles
1. La commande est créée en base **avant** la redirection (statut `PENDING`), avec les prix recalculés serveur.
2. `stripe.checkout.sessions.create({ mode: 'payment', line_items: [{ price_data: { currency: 'eur', unit_amount, product_data: { name, images } }, quantity }], customer_email, metadata: { orderId }, success_url: `${SITE_URL}/checkout/success?order={orderNumber}&session_id={CHECKOUT_SESSION_ID}`, cancel_url })`.
3. Remises : appliquer la remise dans `unit_amount` (répartition) ou via `discounts: [{ coupon }]`. Ici on ajoute une ligne livraison via `shipping_options` ou une ligne dédiée.
4. Webhook `/api/stripe/webhook` : lire le body brut (`await req.text()`), vérifier `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)`, sur `checkout.session.completed` passer la commande en `PAID` et décrémenter le stock (idempotent).
5. **Mode démo** : si `STRIPE_SECRET_KEY` est absente, ne pas appeler Stripe : marquer la commande `PAID` (paiement simulé), décrémenter le stock, rediriger vers la page de confirmation. Afficher un bandeau « Mode démo : aucun paiement réel ».
6. Montants en centimes (entiers) partout en base. Jamais de float pour l'argent.
7. Tester les webhooks en local : `stripe listen --forward-to localhost:3000/api/stripe/webhook`. Carte test : 4242 4242 4242 4242.
