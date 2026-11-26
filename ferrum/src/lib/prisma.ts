import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Sur Vercel (système de fichiers en lecture seule), la base SQLite de démo générée au build
 * est copiée dans /tmp pour rester inscriptible. Les données y sont éphémères (démo uniquement) :
 * en production, utiliser PostgreSQL (voir REPORT.md).
 */
function datasourceUrl() {
  if (!process.env.VERCEL || !process.env.DATABASE_URL?.startsWith("file:")) return undefined;
  const target = "/tmp/ferrum.db";
  if (!existsSync(target)) {
    const source = path.join(process.cwd(), "prisma", "demo.db");
    if (existsSync(source)) copyFileSync(source, target);
  }
  return `file:${target}`;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: datasourceUrl() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
