import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { NewsletterForm } from "@/components/home/newsletter-form";

const cols = [
  {
    title: "Boutique",
    links: [
      { href: "/shop", label: "Tous les produits" },
      { href: "/shop?categorie=maintien", label: "Maintien" },
      { href: "/shop?categorie=grip", label: "Grip & tirage" },
      { href: "/shop?categorie=lest", label: "Lest & résistance" },
      { href: "/shop?categorie=equipement", label: "Sac & hydratation" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/livraison-retours", label: "Livraison & retours" },
      { href: "/livraison-retours#guide-tailles", label: "Guide des tailles" },
      { href: "/livraison-retours#contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-iron-800 bg-iron-900">
      <div className="plate-stripe h-[3px]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-chalk-dim">
            Accessoires de force pensés pour les séances lourdes. Testés sous la barre, expédiés depuis la France.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="font-display text-lg font-bold uppercase tracking-wider">{c.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-chalk-dim transition hover:text-chalk">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-wider">−10 % sur ta 1re commande</h2>
          <p className="mt-2 text-[15px] text-chalk-dim">Programmes, nouveautés et ventes privées. Pas de spam.</p>
          <NewsletterForm compact />
        </div>
      </div>
      <div className="border-t border-iron-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-iron-400 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} FERRUM. Forgé pour la charge.</p>
          <p>Paiement sécurisé · Visa · Mastercard · Apple Pay · Google Pay</p>
        </div>
      </div>
    </footer>
  );
}
