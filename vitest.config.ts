import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        include: ["tests/**/*.test.ts"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@/back/generated/prisma_client": path.resolve(__dirname, "tests/__mocks__/prisma-client.ts"),
            "@/back/generated/prisma_client/edge": path.resolve(__dirname, "tests/__mocks__/prisma-client.ts"),
        },
    },
});
