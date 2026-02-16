"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";

export function ConnexionForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
      <div className="max-w-md mx-auto px-6">
        <h1 className="font-bold text-3xl text-[#1E293B] mb-2">
          Connexion administrateur
        </h1>
        <p className="text-[var(--text-muted)] mb-8">
          Accès réservé aux administrateurs. Après connexion vous serez redirigé vers le tableau de bord.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
        >
          {error && (
            <p className="text-sm text-red-700 bg-red-50 p-3 rounded-xl">
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-[var(--text-muted)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Mot de passe *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-[var(--text-muted)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-[var(--text-muted)] mt-6 text-sm">
          Accès réservé aux administrateurs.
        </p>
      </div>
    </main>
  );
}
