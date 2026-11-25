import Link from "next/link";
import { btn } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="display text-[9rem] font-extrabold leading-none text-iron-700">404</p>
      <h1 className="display mt-2 text-5xl font-extrabold">Barre ratée.</h1>
      <p className="mt-4 text-chalk-dim">Cette page n&apos;existe pas (ou plus). On repart sur une bonne série ?</p>
      <div className="mt-8 flex gap-3">
        <Link href="/shop" className={btn.primary}>
          Voir la boutique
        </Link>
        <Link href="/" className={btn.secondary}>
          Accueil
        </Link>
      </div>
    </div>
  );
}
