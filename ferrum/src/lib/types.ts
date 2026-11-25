export type VariantDTO = {
  id: string;
  name: string;
  color: string | null;
  colorHex: string | null;
  size: string | null;
  sku: string;
  stock: number;
  price: number | null;
  image: string | null;
};

export type ReviewDTO = {
  id: string;
  author: string;
  city: string | null;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

export type SizeGuide = { title: string; headers: string[]; rows: string[][]; note?: string };

/** Produit tel qu'exposé au public (sans prix d'achat ni fournisseur). */
export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  specs: { label: string; value: string }[];
  sizeGuide: SizeGuide | null;
  category: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  badge: string | null;
  featured: boolean;
  isBundle: boolean;
  bundleItems: string[];
  upsells: string[];
  popularity: number;
  rating: number;
  reviewCount: number;
  totalStock: number;
  variants: VariantDTO[];
  updatedAt: string;
};

/** Version allégée pour les grilles (cartes produit). */
export type ProductCardDTO = Pick<
  ProductDTO,
  "id" | "slug" | "name" | "tagline" | "category" | "price" | "compareAtPrice" | "images" | "badge" | "popularity" | "rating" | "reviewCount" | "totalStock" | "isBundle"
> & {
  variantCount: number;
  colors: { name: string; hex: string }[];
  /** Présent si le produit n'a qu'une variante : ajout direct au panier depuis la grille. */
  quickVariant: { id: string; name: string; stock: number; price: number; image: string } | null;
};
