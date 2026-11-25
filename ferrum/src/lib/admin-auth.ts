import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "ferrum_admin";
const TTL_MS = 1000 * 60 * 60 * 12; // 12 h

const secret = () => process.env.ADMIN_SECRET || "ferrum-dev-secret";
export const adminPassword = () => process.env.ADMIN_PASSWORD || "admin123";

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(input: string) {
  return safeEqual(sign(input), sign(adminPassword()));
}

export async function createAdminSession() {
  const exp = String(Date.now() + TTL_MS);
  const jar = await cookies();
  jar.set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function destroyAdminSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

/** À appeler en tête de chaque page et Server Action admin. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
