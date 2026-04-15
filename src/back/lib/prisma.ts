import { PrismaClient, Prisma } from '../generated/prisma_client';
import { PrismaNeonHttp } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL ?? '';

if (!connectionString) {
    throw new Error('DATABASE_URL est manquante dans les variables d\'environnement');
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Use HTTP adapter in production, direct PostgreSQL connection for seeding in dev.
// In dev, we use an explicit Pool with ssl options to avoid the pg v8→v9 sslmode deprecation warning.
const prismaOptions: Prisma.PrismaClientOptions = process.env.NODE_ENV === 'production'
    ? { adapter: new PrismaNeonHttp(connectionString, {}) }
    : { adapter: new PrismaPg(new Pool({ connectionString, ssl: { rejectUnauthorized: true } })) };

const prisma: PrismaClient =
    globalForPrisma.prisma ??
    new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
export { prisma };