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

    findByUsername: async (username: string) => {
        return prisma.user.findUnique({
            where: { username },
            include: {
                Posts: {
                    where: { isPublished: true },
                    include: { author: true, category: true },
                    orderBy: { createdAt: "desc" },
                },
                projects: { orderBy: { createdAt: "desc" } },
                badges: true,
                categoryFollows: { include: { category: true } },
                _count: {
                    select: {
                        Posts: true,
                        projects: true,
                        categoryFollows: true,
                        badges: true,
                    },
                },
            },
        });
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

    findByEmailChangeToken: async (hashedToken: string) => {
        return prisma.user.findFirst({
            where: {
                emailChangeToken: hashedToken,
                emailChangeTokenExpiresAt: { gt: new Date() },
            },
        });
    },

    findCredentialAccount: async (userId: string) => {
        return prisma.account.findFirst({
            where: { userId, providerId: 'credential' },
            select: { password: true },
        });
    },

    savePendingEmailChange: async (
        userId: string,
        data: { pendingEmail: string; emailChangeToken: string; emailChangeTokenExpiresAt: Date }
    ) => {
        return prisma.user.update({ where: { id: userId }, data });
    },

    confirmEmailChange: async (userId: string, newEmail: string) => {
        return prisma.user.update({
            where: { id: userId },
            data: {
                email: newEmail,
                emailVerified: true,
                pendingEmail: null,
                emailChangeToken: null,
                emailChangeTokenExpiresAt: null,
            },
        });
    },
};