import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma_client";

export const UserConfigAction = {
    findById: async (id: string) => {
        return prisma.userConfig.findUnique({ where: { id } });
    },

    findByUserId: async (userId: string) => {
        return prisma.userConfig.findMany({ where: { userId } });
    },

    findAll: async () => {
        return prisma.userConfig.findMany();
    },

    create: async (userId: string, data: {
        title: string;
        content: Prisma.InputJsonValue;
    }) => {
        return prisma.userConfig.create({
            data: {
                ...data,
                userId,
            },
        });
    },

    update: async (id: string, data: {
        title?: string;
        content?: Prisma.InputJsonValue;
    }) => {
        return prisma.userConfig.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string) => {
        return prisma.userConfig.delete({ where: { id } });
    },
};