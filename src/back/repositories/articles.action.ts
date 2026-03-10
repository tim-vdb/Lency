import prisma from "../lib/prisma"

export const ArticlesAction = {
    findById: async (id: string) => {
        return prisma.article.findUnique({ where: { id } })
    },
    findAll: async () => {
        return prisma.article.findMany();
    },
    create: async (userId: string, data: { title: string, slug: string, excerpt: string, content: string, image: string }) => {
        return prisma.article.create({
            data: {
                ...data,
                authorId: userId
            }
        })
    },
    update: async (id: string, data: { title?: string, slug?: string, excerpt?: string, content?: string, image?: string, authorId?: string }) => {
        const updateData: Record<string, unknown> = {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.slug !== undefined && { slug: data.slug }),
            ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
            ...(data.content !== undefined && { content: data.content }),
            ...(data.image !== undefined && { image: data.image }),
        }

        if (data.authorId !== undefined) {
            updateData.author = { connect: { id: data.authorId } };
        }

        return prisma.article.update({
            where: { id },
            data: updateData,
        })
    },
    delete: async (id: string) => {
        return prisma.article.delete({
            where: { id },
        })
    }
}