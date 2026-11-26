import "server-only";
import Stripe from "stripe";

/** null si aucune clé : l'application passe alors en MODE DÉMO. */
export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
export const isDemoMode = () => !stripe;
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const configured = process.env.NEXT_PUBLIC_SITE_URL;
export const siteUrl = () =>
  (configured && !(process.env.VERCEL && configured.includes("localhost"))
    ? configured
    : vercelUrl
      ? `https://${vercelUrl}`
      : "http://localhost:3000"
  ).replace(/\/$/, "");
