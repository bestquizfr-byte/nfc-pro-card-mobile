import { createProduct } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Nouveau produit" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="display text-5xl font-extrabold">Nouveau produit</h1>
      <ProductForm
        action={createProduct}
        submitLabel="Créer le produit"
        initial={{
          name: "",
          slug: "",
          tagline: "",
          description: "",
          category: "grip",
          price: "",
          compareAtPrice: "",
          costPrice: "",
          supplierName: "AliExpress",
          supplierUrl: "https://fr.aliexpress.com/item/",
          images: "/images/products/sangles-figure-8-noir.webp",
          benefits: "",
          badge: "",
          featured: false,
          active: true,
          variants: [],
        }}
      />
    </div>
  );
}
