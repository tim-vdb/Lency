import prisma from "../lib/prisma";

export const BadgesAction = {
    findById: async (id: string) => {
        return prisma.badge.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.badge.findMany();
    },

    create: async (data: {
        name: string;
        description: string;
        iconUrl?: string | null;
        active?: boolean;
    }) => {
        return prisma.badge.create({ data });
    },

    update: async (
        id: string,
        data: {
            name?: string;
            description?: string;
            iconUrl?: string | null;
            active?: boolean;
        }
    ) => {
        return prisma.badge.update({
            where: { id },
            data,
        });
    },

    addUser: async (badgeId: string, userId: string) => {
        return prisma.badge.update({
            where: { id: badgeId },
            data: {
                users: { connect: { id: userId } },
            },
        });
    },

    removeUser: async (badgeId: string, userId: string) => {
        return prisma.badge.update({
            where: { id: badgeId },
            data: {
                users: { disconnect: { id: userId } },
            },
        });
    },

    delete: async (id: string) => {
        return prisma.badge.delete({ where: { id } });
    },
};