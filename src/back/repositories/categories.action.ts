import prisma from "../lib/prisma"
import { PostsAction } from "./posts.action"

export const CategoriesAction = {
    findById: async (id: string) => {
        return prisma.category.findUnique({ where: { id } });
    },

    findBySlug: async (slug: string) => {
        return prisma.category.findUnique({ where: { slug } });
    },

    findAll: async () => {
        return prisma.category.findMany({
            include: {
                _count: { select: { posts: true, ressources: true } },
            },
        });
    },

    findPostsByCategoryId: async (categoryId: string, userId?: string) => {
        const posts = await prisma.post.findMany({
            where: { categoryId, isPublished: true },
            include: { author: true, category: true },
            orderBy: { createdAt: "desc" },
        });
        if (!userId) return posts.map((p) => ({ ...p, isSaved: false, isVoted: false }));
        const { savedIds, votedIds } = await PostsAction.getUserStates(userId, posts.map((p) => p.id));
        return posts.map((p) => ({ ...p, isSaved: savedIds.has(p.id), isVoted: votedIds.has(p.id) }));
    },

    toggleFollow: async (userId: string, categoryId: string) => {
        const existing = await prisma.categoryFollow.findUnique({
            where: { userId_categoryId: { userId, categoryId } },
        });
        if (existing) {
            await prisma.$transaction([
                prisma.categoryFollow.delete({ where: { userId_categoryId: { userId, categoryId } } }),
                prisma.category.update({ where: { id: categoryId }, data: { subscriberCount: { decrement: 1 } } }),
            ]);
            return { following: false };
        }
        await prisma.$transaction([
            prisma.categoryFollow.create({ data: { userId, categoryId } }),
            prisma.category.update({ where: { id: categoryId }, data: { subscriberCount: { increment: 1 } } }),
        ]);
        return { following: true };
    },

    isFollowing: async (userId: string, categoryId: string) => {
        const record = await prisma.categoryFollow.findUnique({
            where: { userId_categoryId: { userId, categoryId } },
        });
        return !!record;
    },

    findFollowedCategoryPosts: async (userId: string) => {
        const follows = await prisma.categoryFollow.findMany({
            where: { userId },
            select: { categoryId: true },
        });
        const categoryIds = follows.map((f) => f.categoryId);
        if (categoryIds.length === 0) return [];
        const posts = await prisma.post.findMany({
            where: { categoryId: { in: categoryIds }, isPublished: true },
            include: { author: true, category: true },
            orderBy: { createdAt: "desc" },
        });
        const { savedIds, votedIds } = await PostsAction.getUserStates(userId, posts.map((p) => p.id));
        return posts.map((p) => ({ ...p, isSaved: savedIds.has(p.id), isVoted: votedIds.has(p.id) }));
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

    findFollowedCategories: async (userId: string) => {
        const follows = await prisma.categoryFollow.findMany({
            where: { userId },
            include: {
                category: {
                    include: {
                        _count: { select: { posts: true, ressources: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return follows.map((f) => f.category);
    },
};