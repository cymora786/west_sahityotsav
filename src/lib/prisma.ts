import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { Pool } from "pg";

const g = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

// Cache the pool in globalThis so hot-reloads in dev don't create extra connections
const pool = g.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

if (!g.pgPool) g.pgPool = pool;

const adapter = new PrismaPg(pool);

export const prisma = g.prisma ?? new PrismaClient({ adapter });

if (!g.prisma) g.prisma = prisma;
