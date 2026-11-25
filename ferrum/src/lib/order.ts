import "server-only";
import { randomInt } from "node:crypto";
import { prisma } from "./prisma";
import { computeTotals } from "./pricing";

export { ORDER_STATUSES, type OrderStatus } from "./order-status";

export async function generateOrderNumber() {
  for (let i = 0; i < 5; i++) {
    const number = `FER-${randomInt(100000, 999999)}`;
    if (!(await prisma.order.findUnique({ where: { number } }))) return number;
  }
  return `FER-${Date.now()}`;
}

export async function findPromo(code?: string | null) {
  if (!code) return null;
  const promo = await prisma.promoCode.findUnique({ where: { code: code.trim().toUpperCase() } });
  return promo?.active ? promo : null;
}

type Line = { productId: string; variantId: string; quantity: number };

/** Recalcule le panier côté serveur à partir de la base (prix, stock, remise). */
export async function priceCart(lines: Line[], promoCode?: string | null) {
  const variants = await prisma.variant.findMany({
    where: { id: { in: lines.map((l) => l.variantId) } },
    include: { product: true },
  });
  const byId = new Map(variants.map((v) => [v.id, v]));
  const items = [];
  const errors: string[] = [];
  for (const l of lines) {
    const v = byId.get(l.variantId);
    if (!v || v.productId !== l.productId || !v.product.active) {
      errors.push("Un article de ton panier n'est plus disponible.");
      continue;
    }
    if (v.stock < l.quantity) {
      errors.push(`Stock insuffisant pour ${v.product.name} (${v.name}) : ${v.stock} restant(s).`);
      continue;
    }
    const images: string[] = JSON.parse(v.product.images);
    items.push({
      productId: v.productId,
      variantId: v.id,
      name: v.product.name,
      variantName: v.name,
      image: v.image ?? images[0] ?? "",
      unitPrice: v.price ?? v.product.price,
      quantity: l.quantity,
    });
  }
  const promo = await findPromo(promoCode);
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  return { items, errors, promo, totals: computeTotals(subtotal, promo?.percent ?? 0) };
}

/** Marque une commande payée et décrémente le stock (idempotent). */
export async function markOrderPaid(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order || order.status !== "PENDING") return order;
    for (const item of order.items) {
      if (item.variantId) {
        await tx.variant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } });
      }
    }
    return tx.order.update({ where: { id: orderId }, data: { status: "PAID" } });
  });
}
