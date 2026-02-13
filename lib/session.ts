import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "session";
const DEFAULT_SECRET = "change-me-in-production-min-32-chars";

function getSecret(): Uint8Array {
  const s = process.env.SESSION_SECRET ?? DEFAULT_SECRET;
  return new TextEncoder().encode(s);
}

const SECRET = getSecret();

export interface SessionUser {
  id: string;
  email: string;
  full_name: string | null;
  role: "customer" | "admin";
}

export async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(SECRET);
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      full_name: (payload.full_name as string) ?? null,
      role: payload.role as "customer" | "admin",
    };
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
