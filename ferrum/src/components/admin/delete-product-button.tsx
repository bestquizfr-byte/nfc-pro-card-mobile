"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`Supprimer définitivement « ${name} » ? Les commandes passées sont conservées.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded p-2 text-chalk-dim hover:bg-iron-800 hover:text-[#ff6b72]" aria-label={`Supprimer ${name}`}>
        <Trash2 size={16} />
      </button>
    </form>
  );
}
