import { getUser } from "@/back/lib/auth-session"
import { AdminUsersAction, AdminProjectsAction, AdminCategoriesAction, AdminPostsAction, AdminResourcesAction } from "@/back/repositories/admin-data.action"
import { Role, ProjectStatus, Visibility } from "@/back/generated/prisma_client"

async function requireAdmin() {
    const user = await getUser()
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
    return user
}

// ─── Users ───────────────────────────────────────────────────────────────────

export const AdminUsersService = {
    findAll: async () => {
        await requireAdmin()
        return AdminUsersAction.findAll()
    },
    updateRole: async (id: string, role: Role) => {
        await requireAdmin()
        return AdminUsersAction.updateRole(id, role)
    },
    delete: async (id: string) => {
        const admin = await requireAdmin()
        if (admin.id === id) throw new Error("Cannot delete yourself")
        return AdminUsersAction.delete(id)
    },
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const AdminProjectsService = {
    findAll: async () => {
        await requireAdmin()
        return AdminProjectsAction.findAll()
    },
    updateStatus: async (id: string, status: ProjectStatus) => {
        await requireAdmin()
        return AdminProjectsAction.updateStatus(id, status)
    },
    updateVisibility: async (id: string, visibility: Visibility) => {
        await requireAdmin()
        return AdminProjectsAction.updateVisibility(id, visibility)
    },
    delete: async (id: string) => {
        await requireAdmin()
        return AdminProjectsAction.delete(id)
    },
}

// ─── Categories ──────────────────────────────────────────────────────────────

export const AdminCategoriesService = {
    findAll: async () => {
        await requireAdmin()
        return AdminCategoriesAction.findAll()
    },
    create: async (data: { name: string; slug: string; description?: string }) => {
        const admin = await requireAdmin()
        return AdminCategoriesAction.create({
            name: data.name,
            slug: data.slug,
            description: data.description,
            creator: { connect: { id: admin.id } },
        })
    },
    update: async (id: string, data: { name?: string; slug?: string; description?: string }) => {
        await requireAdmin()
        return AdminCategoriesAction.update(id, data)
    },
    delete: async (id: string) => {
        await requireAdmin()
        return AdminCategoriesAction.delete(id)
    },
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export const AdminPostsService = {
    findAll: async () => {
        await requireAdmin()
        return AdminPostsAction.findAll()
    },
    updatePublished: async (id: string, isPublished: boolean) => {
        await requireAdmin()
        return AdminPostsAction.updatePublished(id, isPublished)
    },
    delete: async (id: string) => {
        await requireAdmin()
        return AdminPostsAction.delete(id)
    },
}

// ─── Resources ───────────────────────────────────────────────────────────────

export const AdminResourcesService = {
    findAll: async () => {
        await requireAdmin()
        return AdminResourcesAction.findAll()
    },
    delete: async (id: string) => {
        await requireAdmin()
        return AdminResourcesAction.delete(id)
    },
}
