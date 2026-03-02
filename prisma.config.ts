import 'dotenv/config'
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

export default {
    schema: "src/back/prisma",
    migrations: {
        path: "src/back/prisma/migrations",
        seed: 'tsx src/back/prisma/seed.ts',
    },
    datasource: {
        url: env("DATABASE_URL")
    }
} satisfies PrismaConfig;