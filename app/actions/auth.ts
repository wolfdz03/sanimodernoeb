"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { createServiceClient } from "@/lib/supabase/service";
import { setSession, clearSession } from "@/lib/session";

export async function login(formData: { email: string; password: string }) {
  const email = formData.email?.trim().toLowerCase();
  const password = formData.password;
  if (!email || !password) return { error: "Email et mot de passe requis." };

  const supabase = createServiceClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, password_hash, full_name, role")
    .ilike("email", email)
    .maybeSingle();

  if (error) return { error: "Erreur de connexion." };
  if (!user) return { error: "Email ou mot de passe incorrect." };

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return { error: "Email ou mot de passe incorrect." };

  if (user.role !== "admin") {
    return { error: "Accès réservé aux administrateurs." };
  }

  await setSession({
    id: user.id,
    email: user.email,
    full_name: user.full_name ?? null,
    role: user.role as "customer" | "admin",
  });
  redirect("/dashboard");
}

export async function logout() {
  await clearSession();
  redirect("/connexion");
}
