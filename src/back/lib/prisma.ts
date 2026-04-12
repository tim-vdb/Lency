import { PrismaClient } from '../generated/prisma_client';
import { PrismaNeonHttp } from '@prisma/adapter-neon';

const connectionString = process.env.DATABASE_URL ?? '';

if (!connectionString) {
    throw new Error('DATABASE_URL est manquante dans les variables d\'environnement');
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma: PrismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter: new PrismaNeonHttp(connectionString, {}),
        // log: ['query', 'info', 'warn', 'error'], // décommente pour debug
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
export { prisma };