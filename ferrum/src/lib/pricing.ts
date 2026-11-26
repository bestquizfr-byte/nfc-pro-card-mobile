// Règles de prix partagées client/serveur. Le serveur recalcule TOUJOURS.
export const FREE_SHIPPING_THRESHOLD = 6000; // 60,00 €
export const SHIPPING_FEE = 490; // 4,90 €

export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  remainingForFreeShipping: number;
};

export function computeTotals(subtotal: number, promoPercent = 0): Totals {
  const discount = Math.round((subtotal * promoPercent) / 100);
  const afterDiscount = subtotal - discount;
  const shipping = subtotal === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return {
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
    remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount),
  };
}
