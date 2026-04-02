import prisma from "../lib/prisma"

export const CategoriesAction = {
    findById: async (id: string) => {
        return prisma.category.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.category.findMany();
    },

    create: async (userId: string, data: {
        name: string;
        slug: string;
        description?: string;
        iconUrl?: string;
        bannerUrl?: string;
        rules?: string;
        lastPostAt?: Date;
    }) => {
        return prisma.category.create({
            data: {
                ...data,
                createdBy: userId,
            },
        });
    },

    update: async (id: string, data: {
        name?: string;
        slug?: string;
        description?: string;
        iconUrl?: string;
        bannerUrl?: string;
        rules?: string;
        lastPostAt?: Date;
    }) => {
        return prisma.category.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string) => {
        return prisma.category.delete({ where: { id } });
    },
};