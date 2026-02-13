import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { Mistral } from "@mistralai/mistralai";
import fs from "fs";
import path from "path";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (now >= entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX_REQUESTS;
}

function getContextContent(): string {
  try {
    const filePath = path.join(process.cwd(), "docs", "ASSISTANT_CONTEXT.md");
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "Tableau de bord : Vue d’ensemble (/dashboard), Commandes (/dashboard/commandes), Produits (/dashboard/produits), Catégories (/dashboard/categories), Paramètres (/dashboard/parametres). Répondre en français.";
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (!checkRateLimit(session.id)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429 }
    );
  }

  const { getSiteSettings } = await import("@/lib/site-settings");
  const settings = await getSiteSettings();
  const apiKey = settings.mistral_api_key?.trim() || process.env.MISTRAL_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "Assistant non configuré (clé Mistral manquante). Configurez-la dans Paramètres → Intégrations." },
      { status: 503 }
    );
  }

  let body: { message?: string; history?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const userMessage = typeof body.message === "string" ? body.message.trim() : "";
  if (!userMessage) {
    return NextResponse.json({ error: "Le champ message est requis" }, { status: 400 });
  }

  const contextContent = getContextContent();
  const systemPrompt = `Tu es l'assistant du tableau de bord Sani Modern OEB. Tu réponds uniquement aux questions sur cette application (site public et tableau de bord). Utilise les informations suivantes pour répondre de façon courte et précise, en français. Indique où se trouver les fonctionnalités (menu, section, page). Si la question ne concerne pas cette application, réponds poliment que tu ne peux aider que sur ce site.

${contextContent}`;

  const history = Array.isArray(body.history) ? body.history : [];
  const mappedHistory: { role: "user" | "assistant"; content: string }[] = history
    .slice(-10)
    .map((h: { role: string; content: string }) => ({
      role: (h.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
      content: String(h.content ?? "").slice(0, 2000),
    }))
    .filter((m) => m.content.length > 0);
  const messages = [
    ...mappedHistory,
    { role: "user" as const, content: userMessage.slice(0, 2000) },
  ];

  try {
    const mistral = new Mistral({ apiKey });
    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      maxTokens: 1024,
    });

    const raw = response.choices?.[0]?.message?.content;
    const content =
      typeof raw === "string"
        ? raw.trim()
        : Array.isArray(raw)
          ? raw.map((c) => (typeof c === "string" ? c : (c as { text?: string }).text ?? "")).join("").trim()
          : "Je n’ai pas pu générer de réponse.";
    return NextResponse.json({ message: content || "Je n’ai pas pu générer de réponse." });
  } catch (err) {
    console.error("Mistral assistant error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l’appel à l’assistant." },
      { status: 500 }
    );
  }
}
