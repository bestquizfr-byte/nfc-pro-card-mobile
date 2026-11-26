"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/actions";
import { ORDER_STATUSES } from "@/lib/order-status";

export function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <label className="text-sm">
      <span className="sr-only">Statut de la commande</span>
      <select
        defaultValue={status}
        disabled={pending}
        data-testid="order-status-select"
        onChange={(e) => {
          const fd = new FormData();
          fd.set("id", id);
          fd.set("status", e.target.value);
          startTransition(() => updateOrderStatus(fd));
        }}
        className="rounded-md border border-iron-700 bg-iron-850 px-3 py-2 font-semibold text-chalk disabled:opacity-50"
      >
        {Object.entries(ORDER_STATUSES).map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
