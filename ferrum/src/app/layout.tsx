import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Providers } from "@/components/layout/providers";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow" });
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "FERRUM — Accessoires de musculation & force", template: "%s | FERRUM" },
  description:
    "Ceintures à levier, sangles, genouillères 7 mm, magnésie : les accessoires de force FERRUM pour battre tes records. Livraison offerte dès 60 €.",
  openGraph: { type: "website", locale: "fr_FR", siteName: "FERRUM", images: ["/images/lifestyle/hero-deadlift.webp"] },
};

export const viewport: Viewport = { themeColor: "#141518" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${barlow.variable} ${barlowCondensed.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-chalk focus:px-4 focus:py-2 focus:text-iron-950">
          Aller au contenu
        </a>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
