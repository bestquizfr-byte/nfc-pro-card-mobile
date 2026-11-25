import "server-only";
import Stripe from "stripe";

/** null si aucune clé : l'application passe alors en MODE DÉMO. */
export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
export const isDemoMode = () => !stripe;
export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
