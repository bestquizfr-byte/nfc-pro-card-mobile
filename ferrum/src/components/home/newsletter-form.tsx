"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { btn, input } from "@/components/ui/button";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json()) as { ok: boolean; message: string };
    setState(data.ok ? "done" : "error");
    setMessage(data.message);
  }

  if (state === "done") {
    return (
      <p className="mt-4 flex items-start gap-2 rounded-md border border-plate-green/40 bg-plate-green/10 p-3 text-[15px]" role="status">
        <Check size={18} className="mt-0.5 shrink-0 text-plate-green" />
        <span>{message}</span>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`mt-4 flex gap-2 ${compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"}`} noValidate>
      <label htmlFor={compact ? "nl-footer" : "nl-home"} className="sr-only">
        Adresse e-mail
      </label>
      <input
        id={compact ? "nl-footer" : "nl-home"}
        type="email"
        required
        autoComplete="email"
        placeholder="ton@email.fr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={input}
        aria-invalid={state === "error"}
      />
      <button type="submit" className={`${compact ? btn.chalk : btn.primary} shrink-0 !py-3`} disabled={state === "loading"}>
        {state === "loading" ? "…" : "Je m'inscris"}
      </button>
      {state === "error" && (
        <p className="text-sm text-[#ff6b72] sm:basis-full" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
