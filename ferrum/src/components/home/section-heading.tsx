import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ title, sub, href, cta }: { title: string; sub?: string; href?: string; cta?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="display text-5xl font-extrabold sm:text-6xl">{title}</h2>
        {sub && <p className="mt-3 max-w-xl text-chalk-dim">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1.5 font-semibold text-chalk-dim transition hover:text-chalk">
          {cta} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
