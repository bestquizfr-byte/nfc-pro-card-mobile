import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, LogOut, Package, ShoppingCart } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { logout } from "@/app/admin/actions";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin FERRUM" }, robots: { index: false } };
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[210px_1fr] lg:px-8">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-plate-red">Admin</p>
        <nav className="mt-4 flex gap-1 overflow-x-auto lg:flex-col" aria-label="Navigation admin">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-[15px] font-medium text-chalk-dim transition hover:bg-iron-900 hover:text-chalk">
              <Icon size={18} /> {label}
            </Link>
          ))}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-[15px] font-medium text-chalk-dim transition hover:bg-iron-900 hover:text-chalk">
            <ExternalLink size={18} /> Voir la boutique
          </Link>
          <form action={logout}>
            <button type="submit" className="flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-[15px] font-medium text-chalk-dim transition hover:bg-iron-900 hover:text-chalk">
              <LogOut size={18} /> Déconnexion
            </button>
          </form>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
