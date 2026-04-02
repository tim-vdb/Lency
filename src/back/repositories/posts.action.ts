import prisma from "../lib/prisma"

export const PostsAction = {
    findById: async (id: string) => {
        return prisma.post.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.post.findMany();
    },

    create: async (userId: string, data: {
        title: string;
        content: string;
        categoryId: string;
    }) => {
        return prisma.post.create({
            data: {
                ...data,
                authorId: userId,
            }
        });
    },

    update: async (id: string, data: {
        title?: string;
        content?: string;
        isPublished?: boolean;
        isLocked?: boolean;
        categoryId?: string;
    }) => {
        return prisma.post.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string) => {
        return prisma.post.delete({ where: { id } });
    },
};