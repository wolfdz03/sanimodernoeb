"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { createServiceClient } from "@/lib/supabase/service";
import { setSession, clearSession } from "@/lib/session";

export async function login(formData: { email: string; password: string }) {
  const email = formData.email?.trim().toLowerCase();
  const password = formData.password;
  if (!email || !password) return { error: "Email et mot de passe requis." };
  if (password.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caractères." };

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

export async function changePassword(formData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const { getSession } = await import("@/lib/session");
  const user = await getSession();
  if (!user) return { error: "Non connecté." };
  const { currentPassword, newPassword, confirmPassword } = formData;
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Tous les champs sont requis." };
  }
  if (newPassword.length < 8) {
    return { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Les deux mots de passe ne correspondent pas." };
  }

  const supabase = createServiceClient();
  const { data: dbUser, error: fetchError } = await supabase
    .from("users")
    .select("password_hash")
    .eq("id", user.id)
    .single();
  if (fetchError || !dbUser) return { error: "Erreur lors de la vérification." };

  const ok = await bcrypt.compare(currentPassword, dbUser.password_hash);
  if (!ok) return { error: "Mot de passe actuel incorrect." };

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(newPassword, saltRounds);
  const { error: updateError } = await supabase
    .from("users")
    .update({ password_hash })
    .eq("id", user.id);
  if (updateError) return { error: updateError.message };
  return {};
}

export async function changeEmail(formData: {
  currentPassword: string;
  newEmail: string;
  confirmEmail: string;
}) {
  const { getSession } = await import("@/lib/session");
  const user = await getSession();
  if (!user) return { error: "Non connecté." };
  const { currentPassword, newEmail, confirmEmail } = formData;
  const email = newEmail?.trim().toLowerCase();
  if (!currentPassword || !email || !confirmEmail?.trim()) {
    return { error: "Tous les champs sont requis." };
  }
  if (email !== confirmEmail.trim().toLowerCase()) {
    return { error: "Les deux adresses email ne correspondent pas." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Adresse email invalide." };
  }
  if (email === user.email) {
    return { error: "La nouvelle adresse est identique à l'actuelle." };
  }

  const supabase = createServiceClient();
  const { data: dbUser, error: fetchError } = await supabase
    .from("users")
    .select("id, email, password_hash")
    .eq("id", user.id)
    .single();
  if (fetchError || !dbUser) return { error: "Erreur lors de la vérification." };

  const ok = await bcrypt.compare(currentPassword, dbUser.password_hash);
  if (!ok) return { error: "Mot de passe actuel incorrect." };

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .ilike("email", email)
    .maybeSingle();
  if (existing) return { error: "Cette adresse email est déjà utilisée." };

  const { error: updateError } = await supabase
    .from("users")
    .update({ email })
    .eq("id", user.id);
  if (updateError) return { error: updateError.message };

  await setSession({
    id: user.id,
    email,
    full_name: user.full_name ?? null,
    role: user.role,
  });
  return {};
}
