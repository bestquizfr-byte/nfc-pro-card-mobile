"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { cartCount, useCart, useCartHydrated } from "@/lib/cart-store";

const NAV = [
  { href: "/shop", label: "Boutique" },
  { href: "/shop?categorie=maintien", label: "Maintien" },
  { href: "/shop?categorie=grip", label: "Grip & tirage" },
  { href: "/shop?categorie=lest", label: "Lest" },
  { href: "/product/pack-full-pr", label: "Pack Full PR" },
];

export function Header() {
  const hydrated = useCartHydrated();
  const count = useCart((s) => cartCount(s.items));
  const openCart = useCart((s) => s.open);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled ? "border-iron-800 bg-iron-950/90 backdrop-blur-md" : "border-transparent bg-iron-950"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="-ml-2 p-2 text-chalk lg:hidden"
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>
        <Logo />
        <nav className="ml-8 hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-[15px] font-medium transition hover:text-chalk ${
                pathname === n.href ? "text-chalk" : "text-chalk-dim"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Link href="/shop?focus=1" className="p-2.5 text-chalk-dim transition hover:text-chalk" aria-label="Rechercher un produit">
            <Search size={21} />
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative p-2.5 text-chalk transition hover:text-white"
            aria-label={`Ouvrir le panier (${hydrated ? count : 0} article${count > 1 ? "s" : ""})`}
            data-testid="cart-button"
          >
            <ShoppingBag size={22} />
            {hydrated && count > 0 && (
              <span
                className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-plate-red px-1 text-[11px] font-bold text-chalk"
                data-testid="cart-count"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="plate-stripe h-[3px] w-full opacity-90" />

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-sm flex-col bg-iron-900 p-6 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              aria-label="Menu mobile"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button type="button" className="p-2" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <ul className="mt-10 space-y-1">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-iron-800 py-4 font-display text-2xl font-bold uppercase tracking-wide"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-auto text-sm text-chalk-dim">Livraison offerte dès 60 € · Retours 30 jours</p>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
