import { RotateCcw, ShieldCheck, Truck, Zap } from "lucide-react";

const items = [
  { icon: Truck, title: "Livraison offerte", text: "dès 60 € d'achat en France" },
  { icon: Zap, title: "Expédié sous 24 h", text: "jours ouvrés, suivi par e-mail" },
  { icon: RotateCcw, title: "30 jours pour changer d'avis", text: "retour gratuit, échange de taille" },
  { icon: ShieldCheck, title: "Paiement sécurisé", text: "CB, Apple Pay, Google Pay via Stripe" },
];

export function Reassurance({ className = "" }: { className?: string }) {
  return (
    <section aria-label="Nos engagements" className={`border-y border-iron-800 bg-iron-900 ${className}`}>
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-iron-800 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3 bg-iron-900 px-4 py-5 sm:px-6">
            <Icon size={22} className="mt-0.5 shrink-0 text-plate-red" />
            <div>
              <p className="font-semibold leading-tight">{title}</p>
              <p className="mt-0.5 text-sm text-chalk-dim">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
