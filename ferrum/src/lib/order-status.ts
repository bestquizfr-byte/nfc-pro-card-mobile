export const ORDER_STATUSES = {
  PENDING: "En attente",
  PAID: "Payée",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
} as const;
export type OrderStatus = keyof typeof ORDER_STATUSES;

export const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-plate-yellow/15 text-plate-yellow",
  PAID: "bg-plate-blue/20 text-[#8aa8ff]",
  SHIPPED: "bg-chalk/10 text-chalk",
  DELIVERED: "bg-plate-green/15 text-plate-green",
  CANCELLED: "bg-plate-red/15 text-[#ff6b72]",
};
