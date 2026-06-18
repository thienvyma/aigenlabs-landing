import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

export const adminCookieName = "aigenlabs_admin";

interface SessionPayload {
  email: string;
  exp: number;
}

function getAuthSecret(): string | null {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret) return secret;
  return process.env.NODE_ENV === "production" ? null : "dev-only-change-me";
}

function getRequiredSecret(): string {
  const secret = getAuthSecret();
  if (!secret) throw new Error("AUTH_SECRET is required for admin sessions.");
  return secret;
}

function getExpectedCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) return { email, password };
  if (process.env.NODE_ENV === "production") return null;
  return { email: "admin@aigenlabs.local", password: "admin1234" };
}

function base64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getRequiredSecret()).update(payload).digest("base64url");
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const expected = getExpectedCredentials();
  if (!expected || !getAuthSecret()) return false;
  return email === expected.email && password === expected.password;
}

export function createAdminSession(email: string): string {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + 1000 * 60 * 60 * 8
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function readAdminSessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  if (!getAuthSecret()) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || sign(encoded) !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.email || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return readAdminSessionToken(cookieStore.get(adminCookieName)?.value);
}
