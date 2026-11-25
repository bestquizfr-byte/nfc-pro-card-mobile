import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livraison, retours & guide des tailles",
  description: "Délais et frais de livraison, retours gratuits sous 30 jours, guide des tailles des ceintures, genouillères et sangles FERRUM.",
};

const sections = [
  {
    id: "livraison",
    title: "Livraison",
    body: [
      "Commandes expédiées sous 24 h ouvrées, avec numéro de suivi par e-mail.",
      "France métropolitaine : 3 à 5 jours ouvrés. Offerte dès 60 € d'achat, sinon 4,90 €.",
      "Belgique, Luxembourg, Suisse : 5 à 8 jours ouvrés.",
    ],
  },
  {
    id: "retours",
    title: "Retours & échanges",
    body: [
      "Tu as 30 jours après réception pour retourner un article non utilisé, dans son emballage d'origine.",
      "L'échange de taille est gratuit. Le remboursement est effectué sous 5 jours après réception du retour.",
      "Tous nos produits bénéficient de la garantie légale de conformité de 2 ans.",
    ],
  },
  {
    id: "guide-tailles",
    title: "Guide des tailles",
    body: [
      "Ceinture à levier : mesure ton tour de taille au niveau du nombril. S 64–80 cm · M 76–92 cm · L 88–104 cm · XL 100–116 cm.",
      "Genouillères 7 mm : tour du genou jambe tendue, au centre de la rotule. XS 28–31 · S 31–34 · M 34–37 · L 37–40 · XL 40–43 cm.",
      "Sangles Figure 8 : tour de poignet. S < 16 cm · M 16–18 cm · L > 18 cm.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    body: ["Une question sur une taille ou une commande ? Écris-nous à contact@ferrum.fr, réponse sous 24 h ouvrées."],
  },
];

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="display text-6xl font-extrabold">Livraison & retours</h1>
      <div className="mt-10 space-y-12">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="display text-3xl font-extrabold">{s.title}</h2>
            <ul className="mt-4 space-y-2.5 text-lg leading-relaxed text-chalk/85">
              {s.body.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
