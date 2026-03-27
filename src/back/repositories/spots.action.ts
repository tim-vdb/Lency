import prisma from "../lib/prisma";

export const SpotsAction = {
    findById: async (id: string) => {
        return prisma.spot.findUnique({
            where: { id },
            include: { mapLocation: true },
        });
    },

    findAll: async () => {
        return prisma.spot.findMany({
            include: { mapLocation: true },
        });
    },

    create: async (userId: string | null, data: {
        name: string;
        description: string;
        address: string;
        city: string;
        author: string;
        mapLocationId?: string | null;
    }) => {
        return prisma.spot.create({
            data: {
                ...data,
                userId,
            },
        });
    },

    update: async (id: string, data: {
        name?: string;
        description?: string;
        address?: string;
        city?: string;
        mapLocationId?: string | null;
    }) => {
        return prisma.spot.update({
            where: { id },
            data,
        });
    },

    rate: async (id: string, rating: number) => {
        const spot = await prisma.spot.findUnique({ where: { id } });
        if (!spot) throw new Error("Spot not found");

        const newCount = spot.rating_count + 1;
        const newRating = Math.round((spot.rating * spot.rating_count + rating) / newCount);

        return prisma.spot.update({
            where: { id },
            data: {
                rating: newRating,
                rating_count: newCount,
            },
        });
    },

    delete: async (id: string) => {
        return prisma.spot.delete({ where: { id } });
    },
};