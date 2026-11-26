import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/stripe";
import { CATEGORIES } from "@/data/catalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const products = await prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } });
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "weekly", priority: 0.9 },
    ...CATEGORIES.map((c) => ({ url: `${base}/shop?categorie=${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${base}/livraison-retours`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
