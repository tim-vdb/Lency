import prisma from "../lib/prisma";

export const ResourcesAction = {
    findById: async (id: string) => {
        return prisma.resource.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.resource.findMany();
    },

    create: async (data: {
        title: string;
        description?: string | null;
        type: "ASSET" | "TUTORIAL" | "LINK";
        url: string;
        categoryId: string;
    }) => {
        return prisma.resource.create({ data });
    },

    update: async (id: string, data: {
        title?: string;
        description?: string | null;
        type?: "ASSET" | "TUTORIAL" | "LINK";
        url?: string;
        categoryId?: string;
    }) => {
        return prisma.resource.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string) => {
        return prisma.resource.delete({ where: { id } });
    },
};