"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AssistantChat() {
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
    <div className="mt-10 border-t border-slate-200 dark:border-slate-700 pt-8">
      <h2 className="text-lg font-semibold text-[#1E293B] dark:text-white mb-2">
        Assistant
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Posez une question sur l’utilisation du tableau de bord (où trouver une fonctionnalité, comment faire, etc.). Réponses en français.
      </p>

      <div
        ref={listRef}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d1b1b] min-h-[200px] max-h-[360px] overflow-y-auto p-4 space-y-4 mb-4"
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
        <p className="text-sm text-red-700 dark:text-red-300 mb-2">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Votre question…"
          disabled={loading}
          className="flex-1 rounded-xl border border-[var(--dash-border)] bg-white px-4 py-3 text-[var(--dash-text-main)] outline-none transition placeholder:text-[var(--dash-text-muted)] focus:border-[var(--dash-primary)] disabled:opacity-50"
          aria-label="Question pour l’assistant"
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
  );
}
