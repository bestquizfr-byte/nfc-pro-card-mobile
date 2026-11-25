import { BadgeCheck } from "lucide-react";
import type { ReviewDTO } from "@/lib/types";
import { Stars } from "@/components/ui/stars";
import { formatDate } from "@/lib/format";

export function Reviews({ reviews, rating }: { reviews: ReviewDTO[]; rating: number }) {
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }));
  return (
    <section id="avis" className="scroll-mt-24" aria-labelledby="avis-title">
      <h2 id="avis-title" className="display text-5xl font-extrabold">
        Avis clients
      </h2>
      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          <p className="display text-7xl font-extrabold">{rating.toFixed(1)}</p>
          <Stars rating={rating} size={20} className="mt-2" />
          <p className="mt-2 text-sm text-chalk-dim">Basé sur {reviews.length} avis vérifiés</p>
          <ul className="mt-6 space-y-2">
            {dist.map((d) => (
              <li key={d.n} className="flex items-center gap-3 text-sm">
                <span className="w-8 tabular-nums">{d.n} ★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-iron-800">
                  <span
                    className="block h-full rounded-full bg-plate-yellow"
                    style={{ width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%` }}
                  />
                </span>
                <span className="w-6 text-right tabular-nums text-chalk-dim">{d.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="divide-y divide-iron-800">
          {reviews.map((r) => (
            <li key={r.id} className="py-6 first:pt-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Stars rating={r.rating} size={15} />
                <p className="font-semibold">{r.title}</p>
              </div>
              <p className="mt-3 leading-relaxed text-chalk/85">{r.body}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-chalk-dim">
                <span className="font-semibold text-chalk">{r.author}</span>
                {r.city && <span>· {r.city}</span>}
                <span>· {formatDate(r.createdAt)}</span>
                {r.verified && (
                  <span className="inline-flex items-center gap-1 text-plate-green">
                    <BadgeCheck size={15} /> Achat vérifié
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
