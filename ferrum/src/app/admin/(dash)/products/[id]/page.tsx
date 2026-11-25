import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Modifier le produit" };

const eur = (c: number | null) => (c === null ? "" : (c / 100).toFixed(2));

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const p = await prisma.product.findUnique({ where: { id }, include: { variants: { orderBy: { position: "asc" } } } });
  if (!p) notFound();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="display text-5xl font-extrabold">{p.name}</h1>
        <Link href={`/product/${p.slug}`} className="inline-flex items-center gap-1.5 text-sm text-chalk-dim hover:text-chalk" target="_blank">
          Voir la fiche <ExternalLink size={14} />
        </Link>
      </div>
      <ProductForm
        action={updateProduct.bind(null, p.id)}
        submitLabel="Enregistrer"
        initial={{
          name: p.name,
          slug: p.slug,
          tagline: p.tagline,
          description: p.description,
          category: p.category,
          price: eur(p.price),
          compareAtPrice: eur(p.compareAtPrice),
          costPrice: eur(p.costPrice),
          supplierName: p.supplierName,
          supplierUrl: p.supplierUrl,
          images: (JSON.parse(p.images) as string[]).join("\n"),
          benefits: (JSON.parse(p.benefits) as string[]).join("\n"),
          badge: p.badge ?? "",
          featured: p.featured,
          active: p.active,
          variants: p.variants.map((v) => ({
            id: v.id,
            name: v.name,
            color: v.color ?? "",
            colorHex: v.colorHex ?? "",
            size: v.size ?? "",
            stock: String(v.stock),
            price: eur(v.price),
            image: v.image ?? "",
          })),
        }}
      />
    </div>
  );
}
