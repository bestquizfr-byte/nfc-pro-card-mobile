"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkPassword, createAdminSession, destroyAdminSession, requireAdmin } from "@/lib/admin-auth";
import { productFormSchema } from "@/lib/validation";
import { ORDER_STATUSES } from "@/lib/order-status";

export type FormState = { ok: boolean; message: string; fieldErrors?: Record<string, string[] | undefined> };

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { ok: false, message: "Mot de passe incorrect." };
  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Nom de variante requis"),
  color: z.string().trim().optional(),
  colorHex: z
    .string()
    .trim()
    .regex(/^(#[0-9a-fA-F]{6})?$/, "Couleur hex invalide")
    .optional(),
  size: z.string().trim().optional(),
  stock: z.coerce.number().int().min(0, "Stock ≥ 0"),
  price: z.union([z.literal(""), z.coerce.number().positive()]).optional(),
  image: z.string().trim().optional(),
});

const euros = (n: number) => Math.round(n * 100);
const lines = (s?: string) =>
  (s ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function parseProductForm(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = productFormSchema.safeParse({ ...raw, featured: raw.featured === "on", active: raw.active === "on" });
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const first = Object.values(fieldErrors).find((v) => v?.length)?.[0];
    return { error: { ok: false, message: `Vérifie les champs en rouge${first ? ` (${first})` : ""}.`, fieldErrors } };
  }
  let variantsRaw: unknown;
  try {
    variantsRaw = JSON.parse(parsed.data.variants);
  } catch {
    return { error: { ok: false, message: "Variantes illisibles." } };
  }
  const variants = z.array(variantSchema).min(1, "Au moins une variante").safeParse(variantsRaw);
  if (!variants.success) return { error: { ok: false, message: variants.error.issues[0]?.message ?? "Variantes invalides." } };
  const d = parsed.data;
  return {
    data: {
      name: d.name,
      slug: d.slug,
      tagline: d.tagline,
      description: d.description,
      category: d.category,
      price: euros(d.price),
      compareAtPrice: d.compareAtPrice ? euros(d.compareAtPrice) : null,
      costPrice: euros(d.costPrice),
      supplierName: d.supplierName,
      supplierUrl: d.supplierUrl,
      images: JSON.stringify(lines(d.images)),
      benefits: JSON.stringify(lines(d.benefits)),
      badge: d.badge || null,
      featured: d.featured,
      active: d.active,
    },
    variants: variants.data.map((v, i) => ({
      id: v.id,
      name: v.name,
      color: v.color || null,
      colorHex: v.colorHex || null,
      size: v.size || null,
      stock: v.stock,
      price: typeof v.price === "number" ? euros(v.price) : null,
      image: v.image || null,
      position: i,
    })),
  };
}

const skuFor = (slug: string, i: number) =>
  `FER-${slug.split("-").map((w) => w.slice(0, 3).toUpperCase()).join("")}-${String(i + 1).padStart(2, "0")}-${Date.now().toString(36).slice(-4).toUpperCase()}`;

export async function createProduct(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if ("error" in parsed) return parsed.error!;
  if (await prisma.product.findUnique({ where: { slug: parsed.data.slug } })) {
    return { ok: false, message: "Ce slug existe déjà.", fieldErrors: { slug: ["Slug déjà utilisé"] } };
  }
  await prisma.product.create({
    data: {
      ...parsed.data,
      specs: "[]",
      variants: {
        create: parsed.variants.map((v, i) => {
          const { id: _ignored, ...data } = v; // eslint-disable-line @typescript-eslint/no-unused-vars
          return { ...data, sku: skuFor(parsed.data.slug, i) };
        }),
      },
    },
  });
  revalidatePath("/", "layout");
  redirect("/admin/products?cree=1");
}

export async function updateProduct(id: string, _: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if ("error" in parsed) return parsed.error!;
  const clash = await prisma.product.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (clash) return { ok: false, message: "Ce slug existe déjà.", fieldErrors: { slug: ["Slug déjà utilisé"] } };

  const existing = await prisma.variant.findMany({ where: { productId: id }, select: { id: true } });
  const keep = new Set(parsed.variants.map((v) => v.id).filter(Boolean));
  await prisma.$transaction([
    prisma.product.update({ where: { id }, data: parsed.data }),
    prisma.variant.deleteMany({ where: { productId: id, id: { in: existing.map((e) => e.id).filter((e) => !keep.has(e)) } } }),
    ...parsed.variants.map(({ id: vid, ...v }, i) =>
      vid && existing.some((e) => e.id === vid)
        ? prisma.variant.update({ where: { id: vid }, data: v })
        : prisma.variant.create({ data: { ...v, productId: id, sku: skuFor(parsed.data.slug, i) } }),
    ),
  ]);
  revalidatePath("/", "layout");
  return { ok: true, message: "Produit enregistré." };
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.product.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/products?supprime=1");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !(status in ORDER_STATUSES)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
}
