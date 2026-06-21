import { prisma } from "@/back/lib/prisma"
import { Prisma, Role, ProjectStatus, Visibility } from "@/back/generated/prisma_client"

// ─── Users ───────────────────────────────────────────────────────────────────

export const AdminUsersAction = {
    findAll: () =>
        prisma.user.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                email: true,
                role: true,
                isMarketplaceTalent: true,
                emailVerified: true,
                avatarUrl: true,
                image: true,
                createdAt: true,
                _count: { select: { Posts: true, projects: true, resources: true, creator: true } },
            },
            orderBy: { createdAt: "desc" },
        }),

    updateRole: (id: string, role: Role) =>
        prisma.user.update({ where: { id }, data: { role } }),

    delete: (id: string) => prisma.user.delete({ where: { id } }),
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const AdminProjectsAction = {
    findAll: () =>
        prisma.project.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                visibility: true,
                createdAt: true,
                owner: { select: { id: true, firstname: true, lastname: true, username: true, avatarUrl: true, image: true } },
                _count: { select: { participants: true, applications: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
        }),

    updateStatus: (id: string, status: ProjectStatus) =>
        prisma.project.update({ where: { id }, data: { status } }),

    updateVisibility: (id: string, visibility: Visibility) =>
        prisma.project.update({ where: { id }, data: { visibility } }),

    delete: (id: string) => prisma.project.delete({ where: { id } }),
}

// ─── Categories ──────────────────────────────────────────────────────────────

export const AdminCategoriesAction = {
    findAll: () =>
        prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                members: true,
                subscriberCount: true,
                createdAt: true,
                iconUrl: true,
                _count: { select: { posts: true, ressources: true, followers: true } },
                creator: { select: { id: true, firstname: true, lastname: true, username: true, avatarUrl: true, image: true } },
            },
            orderBy: { createdAt: "desc" },
        }),

    create: (data: Prisma.CategoryCreateInput) =>
        prisma.category.create({ data }),

    update: (id: string, data: Prisma.CategoryUpdateInput) =>
        prisma.category.update({ where: { id }, data }),

    delete: (id: string) => prisma.category.delete({ where: { id } }),
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export const AdminPostsAction = {
    findAll: () =>
        prisma.post.findMany({
            select: {
                id: true,
                content: true,
                format: true,
                isPublished: true,
                viewCount: true,
                upvoteCount: true,
                commentCount: true,
                saveCount: true,
                createdAt: true,
                author: { select: { id: true, firstname: true, lastname: true, username: true, avatarUrl: true, image: true } },
                category: { select: { id: true, name: true, slug: true } },
            },
            orderBy: { createdAt: "desc" },
        }),

    updatePublished: (id: string, isPublished: boolean) =>
        prisma.post.update({ where: { id }, data: { isPublished } }),

    delete: (id: string) => prisma.post.delete({ where: { id } }),
}

// ─── Resources ───────────────────────────────────────────────────────────────

export const AdminResourcesAction = {
    findAll: () =>
        prisma.resource.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                urls: true,
                upvoteCount: true,
                saveCount: true,
                commentCount: true,
                viewCount: true,
                createdAt: true,
                author: { select: { id: true, firstname: true, lastname: true, username: true, avatarUrl: true, image: true } },
                category: { select: { id: true, name: true, slug: true } },
            },
            orderBy: { createdAt: "desc" },
        }),

    update: (id: string, data: Prisma.ResourceUpdateInput) =>
        prisma.resource.update({ where: { id }, data }),

    delete: (id: string) => prisma.resource.delete({ where: { id } }),
}
