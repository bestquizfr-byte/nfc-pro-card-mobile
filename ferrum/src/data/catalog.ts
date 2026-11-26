// Catalogue FERRUM — source unique du seed (prisma/seed.ts).
// Prix en centimes TTC. costPrice = prix fournisseur AliExpress relevé le 25/11/2026,
// livraison France incluse (offert dès 10 € d'achat chez le fournisseur).

export type SeedVariant = {
  name: string;
  color?: string;
  colorHex?: string;
  size?: string;
  stock: number;
  price?: number;
  image?: string;
};

export type SeedReview = {
  author: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  daysAgo: number;
};

export type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  specs: { label: string; value: string }[];
  sizeGuide?: { title: string; headers: string[]; rows: string[][]; note?: string };
  category: CategorySlug;
  price: number;
  compareAtPrice?: number;
  costPrice: number;
  supplierName: string;
  supplierUrl: string;
  images: string[];
  badge?: string;
  featured?: boolean;
  isBundle?: boolean;
  bundleItems?: string[];
  upsells?: string[];
  popularity: number;
  variants: SeedVariant[];
  reviews: SeedReview[];
};

export type CategorySlug = "maintien" | "grip" | "lest" | "equipement" | "packs";

export const CATEGORIES: { slug: CategorySlug; name: string; blurb: string; plate: string }[] = [
  { slug: "maintien", name: "Maintien", blurb: "Ceinture, poignets, genoux : verrouille tes articulations.", plate: "#e0262f" },
  { slug: "grip", name: "Grip & tirage", blurb: "Sangles, crochets, magnésie : ta prise ne lâchera plus.", plate: "#2f5bd3" },
  { slug: "lest", name: "Lest & résistance", blurb: "Ajoute de la charge, gagne des reps.", plate: "#f2c230" },
  { slug: "equipement", name: "Sac & hydratation", blurb: "Tout ton matos, toute ta séance.", plate: "#2e9b5f" },
  { slug: "packs", name: "Packs", blurb: "Le kit complet, moins cher.", plate: "#edeae3" },
];

const IMG = (f: string) => `/images/products/${f}.webp`;
const LIFE = (f: string) => `/images/lifestyle/${f}.webp`;
const ALI = (id: string) => `https://fr.aliexpress.com/item/${id}.html`;

const COLORS = {
  noir: { color: "Noir", colorHex: "#24252a" },
  rouge: { color: "Rouge", colorHex: "#c11d24" },
  gris: { color: "Gris acier", colorHex: "#6b6f78" },
  kaki: { color: "Kaki", colorHex: "#4b5236" },
  sable: { color: "Sable", colorHex: "#c9bba0" },
  marron: { color: "Cognac", colorHex: "#7a4a2e" },
} as const;

/** Génère les variantes couleur × taille. */
function grid(
  colors: (keyof typeof COLORS)[],
  sizes: string[] | null,
  imageBase: string,
  stock: (c: string, s: string | null, i: number) => number,
): SeedVariant[] {
  const out: SeedVariant[] = [];
  let i = 0;
  for (const c of colors) {
    for (const s of sizes ?? [null]) {
      const col = COLORS[c];
      out.push({
        name: s ? `${col.color} / ${s}` : col.color,
        ...col,
        size: s ?? undefined,
        stock: stock(c, s, i++),
        image: IMG(`${imageBase}-${c}`),
      });
    }
  }
  return out;
}

export const PRODUCTS: SeedProduct[] = [
  {
    slug: "ceinture-levier-10mm",
    name: "Ceinture à levier 10 mm Forge",
    tagline: "Cuir de vachette, boucle à levier. Le gainage qui débloque tes records.",
    description:
      "La Forge est taillée pour les séries lourdes au squat et au soulevé de terre. Son cuir de vachette de 10 mm garde sa forme sous la charge, et sa boucle à levier se serre ou se libère d'un geste entre deux séries, sans chercher le bon trou. Tu pousses ton ventre contre une paroi rigide, ta pression intra-abdominale grimpe, ton dos reste neutre. Résultat : plus de stabilité, plus de confiance, plus de kilos.",
    benefits: [
      "Serrage et ouverture en 1 seconde grâce au levier",
      "Cuir 10 mm rigide : gainage maximal sur squat et deadlift",
      "Largeur constante de 10 cm, devant comme derrière",
    ],
    specs: [
      { label: "Matière", value: "Cuir de vachette, doublure suédée" },
      { label: "Épaisseur", value: "10 mm" },
      { label: "Largeur", value: "10 cm" },
      { label: "Boucle", value: "Levier acier zingué, vis réglables" },
      { label: "Usage", value: "Squat, soulevé de terre, développé militaire" },
    ],
    sizeGuide: {
      title: "Mesure ton tour de taille au niveau du nombril",
      headers: ["Taille", "Tour de taille"],
      rows: [
        ["S", "64 – 80 cm"],
        ["M", "76 – 92 cm"],
        ["L", "88 – 104 cm"],
        ["XL", "100 – 116 cm"],
      ],
      note: "Entre deux tailles ? Prends la plus petite : le cuir se détend légèrement avec l'usage.",
    },
    category: "maintien",
    price: 7490,
    compareAtPrice: 9490,
    costPrice: 3639,
    supplierName: "AliExpress — Ceinture cuir de vache SBD-style à levier (+1 000 ventes, 4,7★)",
    supplierUrl: ALI("1005010406538066"),
    images: [IMG("ceinture-levier-noir"), IMG("ceinture-levier-studio"), LIFE("hero-deadlift")],
    badge: "Best-seller",
    featured: true,
    upsells: ["sangles-figure-8", "genouilleres-7mm"],
    popularity: 96,
    variants: grid(["noir", "marron", "rouge"], ["S", "M", "L", "XL"], "ceinture-levier", (c, s) =>
      s === "XL" ? (c === "noir" ? 3 : 4) : c === "rouge" ? 9 : 22,
    ),
    reviews: [
      { author: "Mathis L.", city: "Lyon", rating: 5, title: "Le levier change tout", body: "J'avais une ceinture à ardillon, je perdais un temps fou entre les séries. Là c'est clipsé en une seconde. Rigide dès la sortie du carton, il faut 2-3 séances pour qu'elle épouse le corps.", daysAgo: 6 },
      { author: "Inès B.", city: "Bordeaux", rating: 5, title: "Qualité au rendez-vous", body: "Cuir épais, coutures propres, pas d'odeur chimique. J'ai pris un S pour 70 cm de tour de taille, parfait sur le cran du milieu.", daysAgo: 14 },
      { author: "Karim D.", city: "Marseille", rating: 4, title: "Très bonne ceinture", body: "Gros gainage sur le squat, +7,5 kg en 3 semaines (même si je ne fais pas tout grâce à elle). Le tournevis pour régler le levier n'est pas fourni, prévois-le.", daysAgo: 21 },
      { author: "Thomas R.", city: "Lille", rating: 5, title: "Rapport qualité/prix imbattable", body: "Comparé aux marques à 150 €, franchement la différence ne se sent pas sous la barre. Livrée en 6 jours.", daysAgo: 33 },
      { author: "Léa M.", city: "Nantes", rating: 5, title: "Ma première vraie ceinture", body: "Le guide des tailles est juste. Je me sens beaucoup plus solide sur le soulevé de terre.", daysAgo: 47 },
    ],
  },
  {
    slug: "sangles-figure-8",
    name: "Sangles Figure 8 Lockdown",
    tagline: "Ta prise ne lâche plus. Ton dos travaille jusqu'au bout.",
    description:
      "Les sangles en 8 verrouillent tes mains sur la barre : une boucle autour du poignet, l'autre autour de la barre, et c'est fini. Idéales pour les soulevés de terre lourds, les shrugs et les rowings, quand ton grip lâche avant tes dorsaux. Coton/nylon tressé double épaisseur, coutures renforcées et rembourrage au poignet.",
    benefits: [
      "Verrouillage total : tu ne peux pas lâcher la barre",
      "Rembourrage au poignet : zéro marque après la séance",
      "Couture centrale renforcée pour les charges extrêmes",
    ],
    specs: [
      { label: "Matière", value: "Coton/nylon tressé double couche" },
      { label: "Largeur", value: "3,8 cm" },
      { label: "Conditionnement", value: "1 paire" },
      { label: "Usage", value: "Soulevé de terre, shrugs, rowing, rack pull" },
    ],
    sizeGuide: {
      title: "Mesure ton tour de poignet",
      headers: ["Taille", "Tour de poignet"],
      rows: [
        ["S", "moins de 16 cm"],
        ["M", "16 – 18 cm"],
        ["L", "plus de 18 cm"],
      ],
    },
    category: "grip",
    price: 1990,
    compareAtPrice: 2490,
    costPrice: 479,
    supplierName: "AliExpress — Sangles de levage Figure 8 (+1 000 ventes, 4,8★, « Le plus vendu »)",
    supplierUrl: ALI("1005009751953275"),
    images: [IMG("sangles-figure-8-noir"), IMG("sangles-figure-8-studio"), LIFE("deadlift-setup")],
    badge: "Best-seller",
    featured: true,
    upsells: ["magnesie-liquide", "ceinture-levier-10mm"],
    popularity: 98,
    variants: grid(["noir", "rouge", "gris"], ["S", "M", "L"], "sangles-figure-8", (c, s) => (s === "M" ? 40 : 25)),
    reviews: [
      { author: "Hugo P.", city: "Toulouse", rating: 5, title: "Indispensable au deadlift", body: "J'ai passé 200 kg sans que le grip ne lâche. Prends bien ta taille de poignet, le M me va parfaitement à 17 cm.", daysAgo: 4 },
      { author: "Sarah K.", city: "Paris", rating: 5, title: "Enfin des sangles qui ne glissent pas", body: "Beaucoup plus rapides à mettre que les sangles classiques. Le rembourrage est vraiment confortable.", daysAgo: 12 },
      { author: "Yanis T.", city: "Strasbourg", rating: 4, title: "Top", body: "Un peu raides au début, elles s'assouplissent après quelques séances. Rien à redire sur la solidité.", daysAgo: 25 },
      { author: "Romain G.", city: "Rennes", rating: 5, title: "Mes dorsaux disent merci", body: "Je finis enfin mes séries de rowing lourd. Commandé un 2e set pour mon partenaire.", daysAgo: 39 },
    ],
  },
  {
    slug: "genouilleres-7mm",
    name: "Genouillères 7 mm Squat Armor",
    tagline: "Néoprène 7 mm : chaleur, compression et rebond au fond du squat.",
    description:
      "Les Squat Armor gardent tes genoux au chaud et compressés pendant toute la séance. Le néoprène 7 mm offre un vrai soutien et un léger effet rebond en bas du mouvement, sans gêner ta mobilité. Coupe ergonomique, coutures plates anti-irritation, vendues par paire.",
    benefits: [
      "Compression ferme qui stabilise la rotule",
      "Articulations chaudes dès la première série",
      "Effet rebond au fond du squat",
    ],
    specs: [
      { label: "Matière", value: "Néoprène SBR 7 mm" },
      { label: "Longueur", value: "30 cm" },
      { label: "Conditionnement", value: "1 paire (gauche + droite)" },
      { label: "Entretien", value: "Lavage à la main, séchage à plat" },
    ],
    sizeGuide: {
      title: "Mesure le tour du genou, jambe tendue, au centre de la rotule",
      headers: ["Taille", "Tour de genou"],
      rows: [
        ["XS", "28 – 31 cm"],
        ["S", "31 – 34 cm"],
        ["M", "34 – 37 cm"],
        ["L", "37 – 40 cm"],
        ["XL", "40 – 43 cm"],
      ],
      note: "Pour une compression maximale (compétition), descends d'une taille.",
    },
    category: "maintien",
    price: 4490,
    compareAtPrice: 5990,
    costPrice: 1329,
    supplierName: "AliExpress — AOLIKES genouillères néoprène 7 mm, la paire (+3 000 ventes, 4,9★)",
    supplierUrl: ALI("1005007170210963"),
    images: [IMG("genouilleres-7mm-noir"), IMG("genouilleres-7mm-studio"), LIFE("hero-deadlift")],
    badge: "Nouveau",
    featured: true,
    upsells: ["ceinture-levier-10mm", "bandes-poignets"],
    popularity: 90,
    variants: grid(["noir", "rouge", "gris"], ["XS", "S", "M", "L", "XL"], "genouilleres-7mm", (c, s) =>
      s === "XS" ? 2 : s === "M" || s === "L" ? 18 : 10,
    ),
    reviews: [
      { author: "Julien F.", city: "Montpellier", rating: 5, title: "Très bonne compression", body: "Je suis entre S et M, j'ai pris S : serré à enfiler mais exactement ce que je voulais pour le squat lourd.", daysAgo: 9 },
      { author: "Camille V.", city: "Grenoble", rating: 5, title: "Mes genoux revivent", body: "Je n'ai plus ces douleurs à froid en début de séance. Néoprène épais et coutures solides.", daysAgo: 18 },
      { author: "Bastien N.", city: "Dijon", rating: 4, title: "Bon produit", body: "Rien à dire sur la qualité. Elles sentent un peu le néoprène au déballage, ça part après un lavage.", daysAgo: 29 },
      { author: "Nora A.", city: "Nice", rating: 5, title: "Comme les grandes marques", body: "J'avais des Rehband, celles-ci tiennent aussi bien pour moitié prix.", daysAgo: 52 },
    ],
  },
  {
    slug: "bandes-poignets",
    name: "Bandes de poignets 60 cm Brace",
    tagline: "Poignets verrouillés au développé couché et au squat.",
    description:
      "Les Brace enveloppent ton poignet pour l'empêcher de casser vers l'arrière sous la barre. Résultat : la charge passe dans l'avant-bras, pas dans l'articulation. Boucle de pouce, velcro large et élastique ferme : tu règles la tension tour après tour.",
    benefits: [
      "Poignet aligné sous la barre, même en charge maximale",
      "Velcro large qui tient toute la séance",
      "Tension réglable selon l'exercice",
    ],
    specs: [
      { label: "Longueur", value: "60 cm" },
      { label: "Largeur", value: "8 cm" },
      { label: "Matière", value: "Coton élastique, polyester, velcro industriel" },
      { label: "Conditionnement", value: "1 paire" },
    ],
    category: "maintien",
    price: 1990,
    compareAtPrice: 2490,
    costPrice: 489,
    supplierName: "AliExpress — Bandes de protection réglables pour poignet (+10 000 ventes, 4,8★)",
    supplierUrl: ALI("1005006270810351"),
    images: [IMG("bandes-poignets-noir"), IMG("bandes-poignets-studio"), LIFE("chalk-hands")],
    featured: true,
    upsells: ["genouilleres-7mm", "magnesie-liquide"],
    popularity: 88,
    variants: grid(["noir", "rouge", "gris"], null, "bandes-poignets", () => 45),
    reviews: [
      { author: "Alexis C.", city: "Reims", rating: 5, title: "Parfaites au bench", body: "Plus aucune douleur au poignet au développé couché. Le velcro est costaud.", daysAgo: 7 },
      { author: "Manon E.", city: "Tours", rating: 5, title: "Super maintien", body: "Assez rigides pour le lourd, assez souples pour le reste. Je les garde toute la séance.", daysAgo: 22 },
      { author: "Samir H.", city: "Lyon", rating: 4, title: "Bon rapport qualité-prix", body: "Très bien. J'aurais aimé une version 90 cm pour la compétition.", daysAgo: 41 },
    ],
  },
  {
    slug: "magnesie-liquide",
    name: "Magnésie liquide Grip 100 ml",
    tagline: "Mains sèches en 30 secondes. Zéro nuage de poudre dans ta salle.",
    description:
      "La Grip sèche en quelques secondes et laisse une fine couche de magnésie qui tient toute la séance. Parfaite pour les salles qui interdisent la craie en poudre. Une noisette suffit pour plusieurs séries de tirage.",
    benefits: [
      "Séchage en moins de 30 secondes",
      "Autorisée dans les salles qui interdisent la poudre",
      "Un flacon = environ 80 applications",
    ],
    specs: [
      { label: "Contenance", value: "100 ml" },
      { label: "Composition", value: "Carbonate de magnésium, alcool, colophane" },
      { label: "Usage", value: "Musculation, CrossFit, escalade, pole dance" },
      { label: "Précaution", value: "Inflammable, tenir éloigné de la chaleur" },
    ],
    category: "grip",
    price: 1490,
    compareAtPrice: 1790,
    costPrice: 739,
    supplierName: "AliExpress — Craie liquide 50/100 ml anti-transpiration (+2 000 ventes, 4,9★)",
    supplierUrl: ALI("1005010089097954"),
    images: [IMG("magnesie-liquide-100"), IMG("magnesie-liquide-studio"), LIFE("chalk-ball")],
    upsells: ["sangles-figure-8", "crochets-tirage"],
    popularity: 80,
    variants: [
      { name: "100 ml", size: "100 ml", stock: 60, image: IMG("magnesie-liquide-100") },
      { name: "Duo 2 × 100 ml", size: "Duo 2 × 100 ml", stock: 30, price: 2490, image: IMG("magnesie-liquide-duo") },
    ],
    reviews: [
      { author: "Clément J.", city: "Annecy", rating: 5, title: "Ma salle l'accepte", body: "Pas de poudre partout, le coach est content et moi aussi. Ça tient vraiment longtemps.", daysAgo: 3 },
      { author: "Laura S.", city: "Paris", rating: 4, title: "Efficace", body: "Petite odeur d'alcool à l'application, ça s'évapore vite. Grip nettement meilleur sur les tractions.", daysAgo: 16 },
      { author: "Maxime B.", city: "Caen", rating: 5, title: "Indispensable l'été", body: "Je transpire beaucoup des mains, c'est le jour et la nuit.", daysAgo: 35 },
    ],
  },
  {
    slug: "crochets-tirage",
    name: "Crochets de tirage Hookgrip",
    tagline: "Accroche, tire, recommence. Sans jamais penser à ta prise.",
    description:
      "Les Hookgrip remplacent ta prise sur les tirages lourds et les séries longues : le crochet en acier gainé se pose sur la barre, la manchette rembourrée répartit la charge sur le poignet. Parfait pour isoler ton dos sur les rowings, tirages verticaux et shrugs.",
    benefits: [
      "Crochet acier gainé antidérapant",
      "Manchette rembourrée réglable",
      "Mise en place en 5 secondes",
    ],
    specs: [
      { label: "Crochet", value: "Acier, revêtement caoutchouc" },
      { label: "Manchette", value: "Néoprène rembourré, velcro" },
      { label: "Tour de poignet", value: "15 – 22 cm (réglable)" },
      { label: "Conditionnement", value: "1 paire" },
    ],
    category: "grip",
    price: 3490,
    compareAtPrice: 4490,
    costPrice: 1619,
    supplierName: "AliExpress — Paire de crochets antidérapants d'haltérophilie (+10 000 ventes, 4,9★)",
    supplierUrl: ALI("1005009806932185"),
    images: [IMG("crochets-tirage-noir"), IMG("crochets-tirage-studio"), LIFE("athlete-gym")],
    upsells: ["sangles-figure-8", "magnesie-liquide"],
    popularity: 72,
    variants: grid(["noir", "rouge"], null, "crochets-tirage", (c) => (c === "noir" ? 28 : 12)),
    reviews: [
      { author: "Florian M.", city: "Metz", rating: 5, title: "Pour les séries de dos", body: "Je fais mes tirages à la poulie sans que les avant-bras lâchent avant. Très solides.", daysAgo: 11 },
      { author: "Kevin O.", city: "Brest", rating: 4, title: "Bien mais", body: "Excellent sur machines et haltères. Pour le deadlift très lourd je préfère quand même des sangles.", daysAgo: 27 },
      { author: "Aurélie T.", city: "Limoges", rating: 5, title: "Mon kiné valide", body: "Avec une tendinite à l'avant-bras, ces crochets m'ont permis de continuer à m'entraîner.", daysAgo: 44 },
    ],
  },
  {
    slug: "ceinture-lest-dips",
    name: "Ceinture de lest Chain",
    tagline: "Tes dips et tes tractions au poids du corps ne suffisent plus.",
    description:
      "La Chain te permet d'ajouter des disques ou un kettlebell sur tes dips et tractions. Ceinture néoprène contourée qui ne cisaille pas les hanches, chaîne acier de 90 cm et mousqueton renforcé. Charge maximale : 100 kg.",
    benefits: [
      "Ceinture contourée confortable, même à 40 kg de lest",
      "Chaîne acier 90 cm + mousqueton renforcé",
      "Compatible disques et kettlebells",
    ],
    specs: [
      { label: "Ceinture", value: "Néoprène, intérieur rembourré" },
      { label: "Chaîne", value: "Acier, 90 cm" },
      { label: "Charge max.", value: "100 kg" },
      { label: "Taille", value: "Unique (ajustable par la chaîne)" },
    ],
    category: "lest",
    price: 3490,
    compareAtPrice: 4490,
    costPrice: 1449,
    supplierName: "AliExpress — Ceinture de musculation néoprène avec chaîne (+2 000 ventes, 4,9★)",
    supplierUrl: ALI("1005008248081389"),
    images: [IMG("ceinture-lest-noir"), IMG("ceinture-lest-studio"), LIFE("athlete-focus")],
    upsells: ["bandes-traction", "crochets-tirage"],
    popularity: 70,
    variants: [{ name: "Noir", ...COLORS.noir, stock: 35, image: IMG("ceinture-lest-noir") }],
    reviews: [
      { author: "Lucas W.", city: "Paris", rating: 5, title: "Solide", body: "Testée avec 45 kg aux dips, rien ne bouge. La ceinture ne fait pas mal aux hanches.", daysAgo: 8 },
      { author: "Antoine R.", city: "Bordeaux", rating: 5, title: "Parfaite pour le street workout", body: "Rangée dans le sac, je l'emmène au parc pour mes tractions lestées.", daysAgo: 30 },
      { author: "Emma D.", city: "Nancy", rating: 4, title: "Très bien", body: "Chaîne un peu longue pour moi, je la double. Sinon impeccable.", daysAgo: 58 },
    ],
  },
  {
    slug: "bandes-traction",
    name: "Kit 5 bandes de traction",
    tagline: "De ta première traction au muscle-up. 5 résistances, un seul kit.",
    description:
      "Cinq bandes en latex multicouche, codées par couleur comme des disques olympiques, de 5 à 70 kg de résistance. Pour t'assister aux tractions, ajouter de la résistance au squat ou au bench, ou travailler ta mobilité. Livrées avec une pochette de transport.",
    benefits: [
      "5 niveaux de 5 à 70 kg, codés couleur",
      "Latex multicouche qui ne se déchire pas",
      "Tractions assistées, mobilité, échauffement, résistance",
    ],
    specs: [
      { label: "Matière", value: "Latex naturel multicouche" },
      { label: "Longueur", value: "208 cm (boucle)" },
      { label: "Résistances", value: "Jaune 5–15 kg · Rouge 15–25 kg · Noir 25–35 kg · Bleu 35–50 kg · Vert 50–70 kg" },
      { label: "Inclus", value: "Pochette de transport" },
    ],
    category: "lest",
    price: 5490,
    compareAtPrice: 6990,
    costPrice: 2879,
    supplierName: "AliExpress — Bandes d'assistance tractions 5 niveaux (+80 000 ventes, 4,9★)",
    supplierUrl: ALI("1005012986658635"),
    images: [IMG("bandes-traction-kit"), IMG("bandes-traction-studio"), LIFE("athlete-gym")],
    upsells: ["ceinture-lest-dips", "gourde-2l"],
    popularity: 84,
    variants: [{ name: "Kit 5 bandes", size: "Kit 5 bandes", stock: 26, image: IMG("bandes-traction-kit") }],
    reviews: [
      { author: "Chloé F.", city: "Lyon", rating: 5, title: "Ma première traction", body: "Après 6 semaines avec la verte puis la bleue, j'ai fait ma première traction stricte !", daysAgo: 5 },
      { author: "Mehdi Z.", city: "Lille", rating: 5, title: "Très bonne qualité", body: "Épaisses, pas de fissures après 3 mois d'utilisation intensive.", daysAgo: 19 },
      { author: "Pauline G.", city: "Rouen", rating: 4, title: "Complet", body: "Le kit couvre tout. La jaune est un peu légère mais idéale pour la mobilité des épaules.", daysAgo: 37 },
    ],
  },
  {
    slug: "gourde-2l",
    name: "Gourde isotherme 2 L Hydra",
    tagline: "2 litres d'eau glacée pendant 24 h. Repères horaires pour boire assez.",
    description:
      "La Hydra garde ton eau froide 24 h grâce à sa double paroi en inox 304 isolée sous vide. Les repères horaires te rappellent de boire régulièrement, la poignée se porte facilement et la paille intégrée évite de dévisser le bouchon entre deux séries.",
    benefits: [
      "Froid 24 h, chaud 12 h",
      "Repères horaires de 8 h à 18 h",
      "Paille intégrée + poignée de transport",
    ],
    specs: [
      { label: "Contenance", value: "2 L" },
      { label: "Matière", value: "Inox 304 double paroi, sans BPA" },
      { label: "Isolation", value: "Sous vide" },
      { label: "Entretien", value: "Lavage à la main" },
    ],
    category: "equipement",
    price: 3990,
    compareAtPrice: 4990,
    costPrice: 2019,
    supplierName: "AliExpress — Bouteille isotherme inox 2000 ml avec paille (+2 000 ventes, 4,7★)",
    supplierUrl: ALI("1005009984649541"),
    images: [IMG("gourde-2l-noir"), IMG("gourde-2l-studio"), LIFE("barbell-floor")],
    upsells: ["sac-de-sport", "bandes-traction"],
    popularity: 76,
    variants: grid(["noir", "sable", "rouge"], null, "gourde-2l", (c) => (c === "noir" ? 30 : 15)),
    reviews: [
      { author: "Nicolas E.", city: "Toulouse", rating: 5, title: "Glacée toute la journée", body: "Remplie de glaçons le matin, encore des glaçons le soir. Les repères m'aident à boire mes 2 L.", daysAgo: 10 },
      { author: "Sophie L.", city: "Paris", rating: 4, title: "Grosse mais pratique", body: "Elle est imposante, logique pour 2 L. Rentre dans le sac Titan sans souci.", daysAgo: 26 },
      { author: "Quentin A.", city: "Angers", rating: 5, title: "Fini les bouteilles plastique", body: "Solide, belle finition mate, la paille est top entre les séries.", daysAgo: 49 },
    ],
  },
  {
    slug: "sac-de-sport",
    name: "Sac de sport 40 L Titan",
    tagline: "Compartiment chaussures séparé. Ton matos rangé, tes affaires propres.",
    description:
      "Le Titan avale tout ton équipement : ceinture, chaussures, serviette, gourde de 2 L et vêtements de rechange. Son compartiment chaussures ventilé isole tes baskets du reste, la poche avant garde tes clés et ton téléphone à portée de main. Tissu déperlant, bandoulière amovible.",
    benefits: [
      "Compartiment chaussures séparé et ventilé",
      "40 L : rentre une ceinture 10 mm + gourde 2 L",
      "Tissu déperlant, bandoulière amovible",
    ],
    specs: [
      { label: "Volume", value: "40 L" },
      { label: "Dimensions", value: "50 × 27 × 30 cm" },
      { label: "Matière", value: "Polyester 600D déperlant" },
      { label: "Poches", value: "Principale, chaussures, avant zippée, intérieure" },
    ],
    category: "equipement",
    price: 5490,
    compareAtPrice: 6990,
    costPrice: 1919,
    supplierName: "AliExpress — Sac de sport avec compartiment chaussures (+500 ventes, 4,9★)",
    supplierUrl: ALI("1005007011768355"),
    images: [IMG("sac-de-sport-noir"), IMG("sac-de-sport-studio"), LIFE("barbell-plate")],
    upsells: ["gourde-2l", "ceinture-levier-10mm"],
    popularity: 74,
    variants: grid(["noir", "kaki", "gris"], null, "sac-de-sport", (c) => (c === "noir" ? 20 : 8)),
    reviews: [
      { author: "Adrien V.", city: "Nantes", rating: 5, title: "Le compartiment chaussures !", body: "Plus jamais les baskets sur les vêtements propres. Très bonne finition.", daysAgo: 13 },
      { author: "Marion P.", city: "Marseille", rating: 5, title: "Contenance parfaite", body: "Ceinture, genouillères, chaussures d'haltéro, gourde : tout rentre.", daysAgo: 34 },
      { author: "Rayan B.", city: "Créteil", rating: 4, title: "Beau sac", body: "Le kaki est encore plus beau en vrai. Bandoulière un peu fine à mon goût.", daysAgo: 61 },
    ],
  },
  {
    slug: "sangles-lasso",
    name: "Sangles lasso rembourrées",
    tagline: "Les sangles classiques, version confort. Pour tous tes tirages.",
    description:
      "Le grand classique des salles de musculation : une boucle autour du poignet, la sangle s'enroule autour de la barre. Plus polyvalentes que les sangles en 8, elles se libèrent instantanément en cas d'échec. Rembourrage néoprène au poignet et coton tressé antidérapant.",
    benefits: [
      "Libération instantanée en cas d'échec",
      "Rembourrage néoprène confortable",
      "Polyvalentes : barre, haltères, poulies",
    ],
    specs: [
      { label: "Longueur", value: "55 cm" },
      { label: "Largeur", value: "3,8 cm" },
      { label: "Matière", value: "Coton tressé, rembourrage néoprène" },
      { label: "Conditionnement", value: "1 paire" },
    ],
    category: "grip",
    price: 1490,
    compareAtPrice: 1990,
    costPrice: 525,
    supplierName: "AliExpress — Sangles de poignet d'haltérophilie, 2 pièces (+10 000 ventes, 4,9★)",
    supplierUrl: ALI("1005007014464296"),
    images: [IMG("sangles-lasso-noir"), IMG("sangles-lasso-studio"), LIFE("deadlift-setup")],
    upsells: ["magnesie-liquide", "crochets-tirage"],
    popularity: 78,
    variants: grid(["noir", "rouge", "kaki"], null, "sangles-lasso", () => 50),
    reviews: [
      { author: "Valentin C.", city: "Clermont-Ferrand", rating: 5, title: "Simples et efficaces", body: "Exactement ce qu'il faut pour les rowings et le tirage vertical. Le rembourrage fait la différence.", daysAgo: 15 },
      { author: "Justine R.", city: "Rennes", rating: 4, title: "Bien", body: "Bon produit, couleur rouge très sympa. Un peu longues pour mes petites mains.", daysAgo: 40 },
      { author: "Dylan K.", city: "Mulhouse", rating: 5, title: "Rapport qualité/prix", body: "À ce prix-là j'en ai pris deux paires, une pour le sac et une pour la maison.", daysAgo: 66 },
    ],
  },
  {
    slug: "pack-full-pr",
    name: "Pack Full PR",
    tagline: "Ceinture, genouillères, sangles, poignets. Tout pour ton prochain record.",
    description:
      "Le kit complet du powerlifter : la ceinture à levier Forge pour le gainage, les genouillères Squat Armor pour tes squats, les sangles Lockdown pour ton soulevé de terre et les bandes Brace pour ton développé couché. Tu économises près de 30 € par rapport à l'achat séparé.",
    benefits: [
      "4 produits phares, près de 30 € d'économie",
      "Couvre les 3 mouvements : squat, bench, deadlift",
      "Livraison offerte",
    ],
    specs: [
      { label: "Contenu", value: "Ceinture Forge 10 mm noire + Genouillères 7 mm noires + Sangles Figure 8 + Bandes Brace" },
      { label: "Taille", value: "Ceinture et genouillères dans la taille choisie, sangles en M" },
      { label: "Valeur séparée", value: "159,60 €" },
    ],
    sizeGuide: {
      title: "La taille choisie s'applique à la ceinture et aux genouillères",
      headers: ["Taille", "Tour de taille (ceinture)", "Tour de genou (genouillères)"],
      rows: [
        ["S", "64 – 80 cm", "31 – 34 cm"],
        ["M", "76 – 92 cm", "34 – 37 cm"],
        ["L", "88 – 104 cm", "37 – 40 cm"],
        ["XL", "100 – 116 cm", "40 – 43 cm"],
      ],
    },
    category: "packs",
    price: 12990,
    compareAtPrice: 15960,
    costPrice: 5936,
    supplierName: "Assemblage maison : 4 fournisseurs AliExpress (voir chaque produit)",
    supplierUrl: ALI("1005010406538066"),
    images: [IMG("pack-full-pr"), IMG("pack-full-pr-studio"), LIFE("hero-deadlift")],
    badge: "−19 %",
    featured: true,
    isBundle: true,
    bundleItems: ["ceinture-levier-10mm", "genouilleres-7mm", "sangles-figure-8", "bandes-poignets"],
    upsells: ["magnesie-liquide", "sac-de-sport"],
    popularity: 86,
    variants: ["S", "M", "L", "XL"].map((s) => ({ name: s, size: s, stock: s === "XL" ? 3 : 12, image: IMG("pack-full-pr") })),
    reviews: [
      { author: "Théo B.", city: "Lyon", rating: 5, title: "Le kit de départ idéal", body: "Je débutais en powerlifting, j'ai tout ce qu'il faut d'un coup. Belle économie par rapport à l'achat séparé.", daysAgo: 2 },
      { author: "Benjamin H.", city: "Paris", rating: 5, title: "Tout est qualitatif", body: "Ceinture rigide, genouillères bien serrées, sangles solides. Rien à jeter.", daysAgo: 20 },
      { author: "Océane M.", city: "Toulouse", rating: 5, title: "Cadeau parfait", body: "Offert à mon copain, il ne quitte plus sa ceinture.", daysAgo: 38 },
    ],
  },
];

export const PROMO_CODES = [{ code: "FORCE10", percent: 10 }];
