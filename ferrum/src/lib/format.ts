const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const date = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Centimes → "19,90 €" */
export const formatPrice = (cents: number) => eur.format(cents / 100);
export const formatDate = (d: Date | string) => date.format(typeof d === "string" ? new Date(d) : d);
export const percentOff = (price: number, compareAt?: number | null) =>
  compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
