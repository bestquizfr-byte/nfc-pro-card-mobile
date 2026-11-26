import { PrismaClient } from "@prisma/client";
import { PRODUCTS, PROMO_CODES } from "../src/data/catalog";

const prisma = new PrismaClient();
const DAY = 86_400_000;

async function main() {
  console.log("🧹 Nettoyage…");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.promoCode.deleteMany();

  for (const p of PRODUCTS) {
    const prefix = p.slug.split("-").map((w) => w.slice(0, 3).toUpperCase()).join("");
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        benefits: JSON.stringify(p.benefits),
        specs: JSON.stringify(p.specs),
        sizeGuide: p.sizeGuide ? JSON.stringify(p.sizeGuide) : null,
        category: p.category,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        costPrice: p.costPrice,
        supplierName: p.supplierName,
        supplierUrl: p.supplierUrl,
        images: JSON.stringify(p.images),
        badge: p.badge ?? null,
        featured: p.featured ?? false,
        isBundle: p.isBundle ?? false,
        bundleItems: p.bundleItems ? JSON.stringify(p.bundleItems) : null,
        upsells: p.upsells ? JSON.stringify(p.upsells) : null,
        popularity: p.popularity,
        variants: {
          create: p.variants.map((v, i) => ({
            name: v.name,
            color: v.color ?? null,
            colorHex: v.colorHex ?? null,
            size: v.size ?? null,
            sku: `FER-${prefix}-${String(i + 1).padStart(2, "0")}`,
            stock: v.stock,
            price: v.price ?? null,
            image: v.image ?? null,
            position: i,
          })),
        },
        reviews: {
          create: p.reviews.map((r) => ({
            author: r.author,
            city: r.city,
            rating: r.rating,
            title: r.title,
            body: r.body,
            createdAt: new Date(Date.now() - r.daysAgo * DAY),
          })),
        },
      },
    });
    console.log(`  ✓ ${p.name} (${p.variants.length} variantes, ${p.reviews.length} avis)`);
  }

  for (const c of PROMO_CODES) await prisma.promoCode.create({ data: c });

  // Quelques commandes de démonstration pour peupler le dashboard admin.
  const belt = await prisma.product.findUniqueOrThrow({ where: { slug: "ceinture-levier-10mm" }, include: { variants: true } });
  const straps = await prisma.product.findUniqueOrThrow({ where: { slug: "sangles-figure-8" }, include: { variants: true } });
  const demo = [
    { n: "FER-100421", first: "Lucas", last: "Martin", city: "Lyon", cp: "69003", status: "DELIVERED", days: 12, items: [[belt, 1], [straps, 1]] as const },
    { n: "FER-100422", first: "Emma", last: "Bernard", city: "Paris", cp: "75011", status: "SHIPPED", days: 4, items: [[straps, 2]] as const },
    { n: "FER-100423", first: "Hugo", last: "Petit", city: "Lille", cp: "59000", status: "PAID", days: 1, items: [[belt, 1]] as const },
  ];
  for (const o of demo) {
    const lines = o.items.map(([p, q]) => ({ p, v: p.variants[1] ?? p.variants[0], q }));
    const subtotal = lines.reduce((s, l) => s + (l.v.price ?? l.p.price) * l.q, 0);
    const shipping = subtotal >= 6000 ? 0 : 490;
    await prisma.order.create({
      data: {
        number: o.n,
        email: `${o.first.toLowerCase()}.${o.last.toLowerCase()}@exemple.fr`,
        firstName: o.first,
        lastName: o.last,
        address: "12 rue de la République",
        postalCode: o.cp,
        city: o.city,
        country: "France",
        subtotal,
        shipping,
        total: subtotal + shipping,
        status: o.status,
        paymentMode: "DEMO",
        createdAt: new Date(Date.now() - o.days * DAY),
        items: {
          create: lines.map((l) => ({
            productId: l.p.id,
            variantId: l.v.id,
            name: l.p.name,
            variantName: l.v.name,
            image: l.v.image ?? JSON.parse(l.p.images)[0],
            unitPrice: l.v.price ?? l.p.price,
            quantity: l.q,
          })),
        },
      },
    });
  }
  console.log(`🌱 Seed terminé : ${PRODUCTS.length} produits, ${demo.length} commandes de démo, code FORCE10.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
