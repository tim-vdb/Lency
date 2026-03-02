import prisma from "../lib/prisma"

export const CategoriesAction = {
    findById: async (id: string) => {
        return prisma.category.findUnique({
            where: { id },
        })
    },
    findAll: async () => {
        return prisma.category.findMany()
    },
    create: async (userId: string, data: { name: string, slug: string, description?: string, iconUrl?: string, bannerUrl?: string, rules?: string, lastPostAt?: Date }) => {
        return prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description || undefined,
                createdBy: userId,
                iconUrl: data.iconUrl || undefined,
                bannerUrl: data.bannerUrl || undefined,
                rules: data.rules || undefined,
                lastPostAt: data.lastPostAt || undefined,
            },
        })
    },
    update: async (id: string, data: { name?: string, slug?: string, description?: string, iconUrl?: string, bannerUrl?: string, rules?: string, lastPostAt?: Date, createdBy: string }) => {
        const updateData: Record<string, unknown> = {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.slug !== undefined && { slug: data.slug }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.iconUrl !== undefined && { iconUrl: data.iconUrl }),
            ...(data.bannerUrl !== undefined && { bannerUrl: data.bannerUrl }),
            ...(data.rules !== undefined && { rules: data.rules }),
            ...(data.lastPostAt !== undefined && { lastPostAt: data.lastPostAt }),
        };

        if (data.createdBy !== undefined) {
            updateData.createdBy = { connect: { id: data.createdBy } };
        }


        return prisma.category.update({
            where: { id },
            data: updateData,
        })
    },
    delete: async (id: string) => {
        return prisma.category.delete({
            where: { id },
        })
    },
}