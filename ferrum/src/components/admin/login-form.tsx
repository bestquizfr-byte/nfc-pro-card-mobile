"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/admin/actions";
import { btn, input } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, { ok: false, message: "" });
  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Mot de passe
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={input} aria-invalid={!!state.message} />
      </div>
      {state.message && (
        <p className="text-sm text-[#ff6b72]" role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${btn.primary} w-full`}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
