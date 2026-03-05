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

    create: async (data: {
        name: string;
        description: string;
        address: string;
        city: string;
        author: string;
        rating?: number;
        rating_count?: number;
        mapLocationId?: string | null;
    }) => {
        return prisma.spot.create({
            data: {
                name: data.name,
                description: data.description,
                address: data.address,
                city: data.city,
                author: data.author,
                rating: data.rating ?? 0,
                rating_count: data.rating_count ?? 0,
                ...(data.mapLocationId
                    ? { mapLocation: { connect: { id: data.mapLocationId } } }
                    : {}),
            },
        });
    },

    update: async (
        id: string,
        data: {
            name?: string;
            description?: string;
            address?: string;
            city?: string;
            author?: string;
            rating?: number;
            rating_count?: number;
            mapLocationId?: string | null;
        }
    ) => {
        const updateData: Record<string, unknown> = {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.address !== undefined && { address: data.address }),
            ...(data.city !== undefined && { city: data.city }),
            ...(data.author !== undefined && { author: data.author }),
            ...(data.rating !== undefined && { rating: data.rating }),
            ...(data.rating_count !== undefined && { rating_count: data.rating_count }),
        };

        if (data.mapLocationId !== undefined) {
            if (data.mapLocationId === null) {
                updateData.mapLocation = { disconnect: true };
            } else {
                updateData.mapLocation = { connect: { id: data.mapLocationId } };
            }
        }

        return prisma.spot.update({
            where: { id },
            data: updateData,
        });
    },

    delete: async (id: string) => {
        return prisma.spot.delete({
            where: { id },
        });
    },
};