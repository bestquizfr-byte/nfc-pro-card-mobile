import { formatPrice, percentOff } from "@/lib/format";

export function Price({
  price,
  compareAt,
  size = "md",
}: {
  price: number;
  compareAt?: number | null;
  size?: "sm" | "md" | "lg";
}) {
  const off = percentOff(price, compareAt);
  const main = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`font-display font-bold tracking-wide text-chalk ${main}`}>{formatPrice(price)}</span>
      {off > 0 && (
        <>
          <s className="text-sm text-iron-400">{formatPrice(compareAt!)}</s>
          <span className="rounded-sm bg-plate-red/15 px-1.5 py-0.5 text-xs font-semibold text-[#ff6b72]">−{off} %</span>
        </>
      )}
    </span>
  );
}
