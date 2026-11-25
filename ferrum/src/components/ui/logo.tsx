import Link from "next/link";

export function PlateMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#e0262f" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#141518" strokeWidth="1.5" opacity=".45" />
      <circle cx="16" cy="16" r="4.5" fill="#d9dbe0" />
      <circle cx="16" cy="16" r="2" fill="#141518" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2" aria-label="FERRUM, retour à l'accueil">
      <PlateMark className="h-7 w-7 transition-transform duration-500 group-hover:rotate-[120deg]" />
      <span className="font-display text-[1.7rem] font-extrabold leading-none tracking-[0.06em] text-chalk">FERRUM</span>
    </Link>
  );
}
