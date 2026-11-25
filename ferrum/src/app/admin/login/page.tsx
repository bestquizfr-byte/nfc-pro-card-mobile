import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/login-form";
import { PlateMark } from "@/components/ui/logo";

export const metadata: Metadata = { title: "Connexion admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-16">
      <PlateMark className="h-12 w-12" />
      <h1 className="display mt-5 text-5xl font-extrabold">Espace admin</h1>
      <p className="mt-2 text-chalk-dim">Accès réservé à l&apos;équipe FERRUM.</p>
      <LoginForm />
    </div>
  );
}
