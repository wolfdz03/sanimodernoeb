"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

export function ConnexionForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-[var(--primary-subtle)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E293B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
      </div>

      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au site
      </Link>

      <div className="w-full max-w-[420px]">
        {/* Card */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)]" />

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary-subtle)] flex items-center justify-center mb-4 ring-4 ring-[var(--primary-muted)]/50">
                <Lock className="w-7 h-7 text-[var(--primary)]" strokeWidth={2} />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
                Connexion administrateur
              </h1>
              <p className="mt-2 text-sm text-[var(--text-muted)] max-w-[280px]">
                Accès réservé aux administrateurs. Vous serez redirigé vers le tableau de bord après connexion.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 text-sm"
                >
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-80" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@exemple.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-[var(--text)] placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-[var(--text)] placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">Minimum 8 caractères</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] focus:ring-2 focus:ring-[var(--primary)]/30 focus:ring-offset-2 transition disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                    Connexion en cours…
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <p className="text-center text-xs text-[var(--text-muted)] mt-6">
              Accès sécurisé réservé aux administrateurs du site.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
