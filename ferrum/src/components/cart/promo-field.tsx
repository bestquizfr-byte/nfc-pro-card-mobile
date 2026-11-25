"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { input } from "@/components/ui/button";

export function PromoField() {
  const promo = useCart((s) => s.promo);
  const setPromo = useCart((s) => s.setPromo);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch(`/api/promo?code=${encodeURIComponent(code.trim())}`);
    const data = (await res.json()) as { valid: boolean; code?: string; percent?: number; message?: string };
    setLoading(false);
    if (data.valid && data.code && data.percent) {
      setPromo({ code: data.code, percent: data.percent });
      setCode("");
      setOpen(false);
    } else setError(data.message ?? "Code invalide");
  }

  if (promo) {
    return (
      <div className="flex items-center justify-between rounded-md border border-plate-green/40 bg-plate-green/10 px-3 py-2 text-sm" data-testid="promo-applied">
        <span className="flex items-center gap-2">
          <Tag size={15} className="text-plate-green" />
          Code <strong>{promo.code}</strong> appliqué (−{promo.percent} %)
        </span>
        <button type="button" onClick={() => setPromo(null)} className="p-1 text-chalk-dim hover:text-chalk" aria-label="Retirer le code promo">
          <X size={16} />
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-2 text-sm text-chalk-dim underline-offset-4 hover:text-chalk hover:underline">
        <Tag size={15} /> J&apos;ai un code promo
      </button>
    );
  }

  return (
    <form onSubmit={apply} className="space-y-1.5">
      <div className="flex gap-2">
        <label htmlFor="promo" className="sr-only">
          Code promo
        </label>
        <input
          id="promo"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Code promo"
          className={`${input} !py-2.5 uppercase`}
          aria-invalid={!!error}
          autoFocus
          data-testid="promo-input"
        />
        <button type="submit" disabled={loading} className="shrink-0 rounded-md border border-chalk/25 px-4 text-sm font-semibold hover:border-chalk" data-testid="promo-submit">
          {loading ? "…" : "Appliquer"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-[#ff6b72]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
