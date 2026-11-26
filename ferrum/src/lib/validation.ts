import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide"),
  firstName: z.string().trim().min(2, "Prénom requis"),
  lastName: z.string().trim().min(2, "Nom requis"),
  address: z.string().trim().min(5, "Adresse requise"),
  address2: z.string().trim().max(120).optional().or(z.literal("")),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Code postal à 5 chiffres"),
  city: z.string().trim().min(2, "Ville requise"),
  country: z.enum(["France", "Belgique", "Luxembourg", "Suisse"], { message: "Pays non desservi" }),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?\d[\d\s.-]{7,})?$/, "Numéro invalide")
    .optional()
    .or(z.literal("")),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutRequestSchema = z.object({
  customer: checkoutSchema,
  items: z.array(cartLineSchema).min(1, "Panier vide").max(50),
  promoCode: z.string().trim().max(32).optional().nullable(),
});

export const productFormSchema = z.object({
  name: z.string().trim().min(3, "Nom trop court"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug : minuscules, chiffres et tirets"),
  tagline: z.string().trim().min(5, "Accroche requise"),
  description: z.string().trim().min(20, "Description trop courte"),
  category: z.enum(["maintien", "grip", "lest", "equipement", "packs"]),
  price: z.coerce.number().positive("Prix invalide"),
  compareAtPrice: z.coerce.number().nonnegative().optional(),
  costPrice: z.coerce.number().nonnegative("Prix d'achat invalide"),
  supplierName: z.string().trim().min(2, "Fournisseur requis"),
  supplierUrl: z.string().trim().url("URL fournisseur invalide"),
  images: z.string().trim().min(1, "Au moins une image"),
  benefits: z.string().trim().optional(),
  badge: z.string().trim().max(20).optional(),
  featured: z.boolean(),
  active: z.boolean(),
  variants: z.string().trim().min(1, "Au moins une variante"),
});
