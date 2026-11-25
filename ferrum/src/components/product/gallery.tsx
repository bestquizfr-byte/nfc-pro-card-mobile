"use client";

import Image from "next/image";
import { cn } from "@/lib/format";

export function Gallery({
  images,
  active,
  onSelect,
  name,
}: {
  images: string[];
  active: number;
  onSelect: (i: number) => void;
  name: string;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      <div className="flex gap-3 overflow-x-auto lg:flex-col" role="tablist" aria-label="Photos du produit">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`Photo ${i + 1}`}
            onClick={() => onSelect(i)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-iron-900 transition",
              active === i ? "border-chalk" : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative aspect-square flex-1 overflow-hidden rounded-xl bg-iron-900">
        {images.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={i === 0 ? name : `${name}, vue ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn("object-cover transition-opacity duration-300", active === i ? "opacity-100" : "opacity-0")}
          />
        ))}
      </div>
    </div>
  );
}
