import { redirect } from "next/navigation";
import { getSession } from "./session";

export type SessionUser = Awaited<ReturnType<typeof getSession>>;

export async function getCurrentUser() {
  return getSession();
}

export async function requireAuth() {
  const user = await getSession();
  if (!user) redirect("/connexion");
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") redirect("/");
  return user;
}
