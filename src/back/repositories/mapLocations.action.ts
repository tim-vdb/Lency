import prisma from "../lib/prisma";

export const MapLocationsAction = {
    findById: async (id: string) => {
        return prisma.mapLocation.findUnique({
            where: { id },
            include: { Spots: true, Projects: true },
        });
    },

    findAll: async () => {
        return prisma.mapLocation.findMany({
            include: { Spots: true, Projects: true },
        });
    },

    create: async (data: {
        name: string;
        latitude: number;
        longitude: number;
        description?: string | null;
    }) => {
        return prisma.mapLocation.create({ data });
    },

    update: async (id: string, data: {
        name?: string;
        latitude?: number;
        longitude?: number;
        description?: string | null;
    }) => {
        return prisma.mapLocation.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string) => {
        return prisma.mapLocation.delete({ where: { id } });
    },
};