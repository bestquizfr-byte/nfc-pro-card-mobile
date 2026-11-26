import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

const messages = [
  `Livraison offerte dès ${formatPrice(FREE_SHIPPING_THRESHOLD).replace(",00", "")}`,
  "−10 % sur ta 1re commande avec le code FORCE10",
  "Retours gratuits sous 30 jours",
  "Expédition sous 24 h ouvrées",
];

export function AnnouncementBar() {
  const row = [...messages, ...messages];
  return (
    <div className="relative overflow-hidden bg-plate-red text-chalk">
      <div className="flex w-max animate-marquee gap-12 py-2 text-[13px] font-semibold tracking-wide motion-reduce:animate-none">
        {row.map((m, i) => (
          <span key={i} className="flex items-center gap-12 whitespace-nowrap" aria-hidden={i >= messages.length}>
            {m}
            <span className="h-1.5 w-1.5 rounded-full bg-chalk/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
