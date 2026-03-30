import { prisma } from "../lib/prisma";

export const UsersAction = {
    findById: async (id: string) => {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    findAll: async () => {
        return prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
    },

    findByEmail: async (email: string) => {
        return prisma.user.findUnique({
            where: { email },
            select: { firstname: true }
        }).catch(() => null);
    },

    create: async (data: {
        email: string;
        name?: string;
        firstname?: string;
        lastname?: string;
        username?: string;
        password?: string;
        role?: "ADMIN" | "MEMBER";
    }) => {
        return prisma.user.create({ data });
    },

    update: async (
        id: string,
        data: {
            name?: string;
            firstname?: string;
            lastname?: string;
            username?: string;
            phone?: string;
            bio?: string;
            avatarUrl?: string;
            cv?: string;
            portfolio?: string;
            role?: "ADMIN" | "MEMBER";
            isPremium?: boolean;
        }
    ) => {
        return prisma.user.update({ where: { id }, data });
    },

    delete: async (id: string) => {
        return prisma.user.delete({ where: { id } });
    },
};