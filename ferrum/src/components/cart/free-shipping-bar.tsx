import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";

export function FreeShippingBar({ remaining }: { remaining: number }) {
  const pct = Math.min(100, ((FREE_SHIPPING_THRESHOLD - remaining) / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div>
      <p className="flex items-center gap-2 text-sm" data-testid="free-shipping-message">
        <Truck size={16} className={remaining === 0 ? "text-plate-green" : "text-chalk-dim"} />
        {remaining === 0 ? (
          <span>
            <strong className="text-plate-green">Livraison offerte</strong> débloquée !
          </span>
        ) : (
          <span>
            Plus que <strong>{formatPrice(remaining)}</strong> pour la livraison offerte
          </span>
        )}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-iron-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label="Progression vers la livraison offerte"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${remaining === 0 ? "bg-plate-green" : "bg-plate-red"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
