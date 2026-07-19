"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AssistantDrawer() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/dashboard/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur");
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message ?? "" }]);
    } catch {
      setError("Erreur de connexion.");
    }
    setLoading(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--dash-primary)] text-white shadow-lg shadow-red-500/25 transition-colors hover:bg-[var(--dash-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--dash-primary)] focus:ring-offset-2 bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] end-[max(1.25rem,env(safe-area-inset-right,0px))]"
        aria-label="Ouvrir l'assistant"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer - use right-0 so it stays on the right in both LTR and RTL (Arabic) */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#0d1b1b] shadow-2xl z-[70] flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Assistant"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-lg text-[#1E293B] dark:text-white">
            Assistant
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
          Posez une question sur le tableau de bord. Réponses en français.
        </p>

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
        >
          {messages.length === 0 && !loading && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ex. : « Où modifier le numéro de téléphone ? » « Comment marquer une commande comme livrée ? »
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-[var(--dash-primary)] text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-[#1E293B] dark:text-slate-200"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">
                …
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="px-4 py-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Votre question…"
            disabled={loading}
            className="flex-1 rounded-xl border border-[var(--dash-border)] bg-white px-4 py-3 text-[var(--dash-text-main)] outline-none transition placeholder:text-[var(--dash-text-muted)] focus:border-[var(--dash-primary)] disabled:opacity-50"
            aria-label="Question pour l'assistant"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-[var(--dash-primary)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--dash-primary-hover)] disabled:opacity-50"
          >
            Envoyer
          </button>
        </form>
      </div>
    </>
  );
}
