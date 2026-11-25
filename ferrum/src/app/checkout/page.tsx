import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { isDemoMode } from "@/lib/stripe";

export const metadata: Metadata = { title: "Commande", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const { annule } = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
      <h1 className="display text-6xl font-extrabold">Commande</h1>
      {annule && (
        <p className="mt-4 rounded-md border border-plate-yellow/40 bg-plate-yellow/10 p-3 text-sm" role="status">
          Paiement annulé : ton panier est intact, tu peux réessayer quand tu veux.
        </p>
      )}
      <CheckoutForm demo={isDemoMode()} />
    </div>
  );
}
