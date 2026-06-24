import { PrismaClient, Prisma } from '../generated/prisma_client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL ?? '';

if (!connectionString) {
    throw new Error('DATABASE_URL est manquante dans les variables d\'environnement');
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Strip sslmode from the connection string for the pg Pool — ssl is passed explicitly below,
// which avoids the pg v8→v9 deprecation warning about 'require'/'prefer' becoming libpq aliases.
function stripSslMode(url: string): string {
    try {
        const u = new URL(url);
        u.searchParams.delete('sslmode');
        return u.toString();
    } catch {
        return url.replace(/[?&]sslmode=[^&]*/g, '');
    }
}

const prismaOptions: Prisma.PrismaClientOptions = process.env.NODE_ENV === 'production'
    ? { adapter: new PrismaNeon({ connectionString }) }
    : { adapter: new PrismaPg(new Pool({
        connectionString: stripSslMode(connectionString),
        ssl: { rejectUnauthorized: true },
        statement_timeout: 30000,
        application_name: 'lency'
    })) };

const prisma: PrismaClient =
    globalForPrisma.prisma ??
    new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
export { prisma };