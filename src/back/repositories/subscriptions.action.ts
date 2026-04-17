import prisma from "../lib/prisma";

export const SubscriptionsAction = {
    findById: async (id: string) => {
        return prisma.subscription.findUnique({ where: { id } });
    },

    findByUserId: async (userId: string) => {
        return prisma.subscription.findUnique({ where: { userId } });
    },

    findAll: async () => {
        return prisma.subscription.findMany();
    },

    create: async (userId: string, data: {
        status: "ACTIVE" | "CANCELED" | "EXPIRED";
        startedAt: Date;
        endedAt?: Date | null;
    }) => {
        return prisma.subscription.create({
            data: {
                ...data,
                userId,
            },
        });
    },

    update: async (id: string, data: {
        status?: "ACTIVE" | "CANCELED" | "EXPIRED";
        startedAt?: Date;
        endedAt?: Date | null;
    }) => {
        return prisma.subscription.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string) => {
        return prisma.subscription.delete({ where: { id } });
    },
};