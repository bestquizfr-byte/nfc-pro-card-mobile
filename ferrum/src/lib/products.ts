import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { ProductCardDTO, ProductDTO, ReviewDTO } from "./types";

const include = {
  variants: { orderBy: { position: "asc" } },
  reviews: { select: { rating: true } },
} satisfies Prisma.ProductInclude;

type Row = Prisma.ProductGetPayload<{ include: typeof include }>;

const parse = <T,>(s: string | null | undefined, fallback: T): T => {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
};

function toDTO(p: Row): ProductDTO {
  const reviewCount = p.reviews.length;
  const rating = reviewCount ? p.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount : 0;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    benefits: parse(p.benefits, []),
    specs: parse(p.specs, []),
    sizeGuide: parse(p.sizeGuide, null),
    category: p.category,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: parse(p.images, []),
    badge: p.badge,
    featured: p.featured,
    isBundle: p.isBundle,
    bundleItems: parse(p.bundleItems, []),
    upsells: parse(p.upsells, []),
    popularity: p.popularity,
    rating: Math.round(rating * 10) / 10,
    reviewCount,
    totalStock: p.variants.reduce((s, v) => s + v.stock, 0),
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      color: v.color,
      colorHex: v.colorHex,
      size: v.size,
      sku: v.sku,
      stock: v.stock,
      price: v.price,
      image: v.image,
    })),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function toCard(p: ProductDTO): ProductCardDTO {
  const colors = new Map<string, string>();
  for (const v of p.variants) if (v.color && v.colorHex) colors.set(v.color, v.colorHex);
  const only = p.variants.length === 1 ? p.variants[0] : null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    category: p.category,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images.slice(0, 2),
    badge: p.badge,
    popularity: p.popularity,
    rating: p.rating,
    reviewCount: p.reviewCount,
    totalStock: p.totalStock,
    isBundle: p.isBundle,
    quickVariant: only
      ? { id: only.id, name: only.name, stock: only.stock, price: only.price ?? p.price, image: only.image ?? p.images[0] }
      : null,
    variantCount: p.variants.length,
    colors: [...colors].map(([name, hex]) => ({ name, hex })),
  };
}

export const getProducts = cache(async (): Promise<ProductDTO[]> => {
  const rows = await prisma.product.findMany({
    where: { active: true },
    include,
    orderBy: { popularity: "desc" },
  });
  return rows.map(toDTO);
});

export const getProductBySlug = cache(async (slug: string): Promise<ProductDTO | null> => {
  const row = await prisma.product.findFirst({ where: { slug, active: true }, include });
  return row ? toDTO(row) : null;
});

export const getReviews = cache(async (productId: string): Promise<ReviewDTO[]> => {
  const rows = await prisma.review.findMany({ where: { productId }, orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
});

export async function getLatestReviews(take = 6) {
  const rows = await prisma.review.findMany({
    where: { rating: 5 },
    orderBy: { createdAt: "desc" },
    take,
    include: { product: { select: { name: true, slug: true } } },
  });
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}
