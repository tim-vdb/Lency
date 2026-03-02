import prisma from "../lib/prisma"

export const PostsAction = {
    findById: async (id: string) => {
        return prisma.post.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.post.findMany();
    },

    create: async (userId: string, data: { title: string, content: string, categoryId: string }) => {
        return prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                categoryId: data.categoryId,
                authorId: userId,
            }
        });
    },

    update: async (
        id: string,
        data: {
            title?: string,
            content?: string,
            isPublished?: boolean,
            isLocked?: boolean,
            categoryId?: string,
            authorId?: string,
            viewCount?: number,
            upvoteCount?: number,
            commentCount?: number,
        }
    ) => {
        const updateData: Record<string, unknown> = {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.content !== undefined && { content: data.content }),
            ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
            ...(data.isLocked !== undefined && { isLocked: data.isLocked }),
            ...(data.viewCount !== undefined && { viewCount: data.viewCount }),
            ...(data.upvoteCount !== undefined && { upvoteCount: data.upvoteCount }),
            ...(data.commentCount !== undefined && { commentCount: data.commentCount }),
        };

        if (data.authorId !== undefined) updateData.author = { connect: { id: data.authorId } };
        if (data.categoryId !== undefined) updateData.category = { connect: { id: data.categoryId } };

        return prisma.post.update({ where: { id }, data: updateData });
    },

    delete: async (id: string) => {
        return prisma.post.delete({ where: { id } });
    },
}
