import prisma from "../lib/prisma";

export const ProjectsAction = {
    findById: async (id: string) => {
        return prisma.project.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.project.findMany();
    },

    create: async (userId: string, data: {
        title: string;
        description: string;
        mapLocationId?: string | null;
    }) => {
        return prisma.project.create({
            data: {
                ...data,
                ownerId: userId,
            },
        });
    },

    update: async (id: string, data: {
        title?: string;
        description?: string;
        status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
        mapLocationId?: string | null;
    }) => {
        return prisma.project.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string) => {
        return prisma.project.delete({ where: { id } });
    },
};