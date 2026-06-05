import prisma from "../lib/prisma";

export const BlogsAction = {
    findById: async (id: string) => {
        return prisma.blog.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.blog.findMany({
            include: { author: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: "desc" },
        });
    },

    create: async (
        authorId: string,
        data: {
            title: string;
            content: string;
            tag: "VIDEO" | "MOTION" | "OUTILS";
            coverUrl?: string;
            status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
        }
    ) => {
        return prisma.blog.create({
            data: {
                title: data.title,
                content: data.content,
                tag: data.tag,
                coverUrl: data.coverUrl,
                status: data.status ?? "DRAFT",
                author: { connect: { id: authorId } },
            },
        });
    },

    update: async (
        id: string,
        data: {
            title?: string;
            content?: string;
            tag?: "VIDEO" | "MOTION" | "OUTILS";
            coverUrl?: string;
            status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
        }
    ) => {
        return prisma.blog.update({ where: { id }, data });
    },

    delete: async (id: string) => {
        return prisma.blog.delete({ where: { id } });
    },
};
