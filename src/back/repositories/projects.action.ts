import prisma from "../lib/prisma";

export const ProjectsAction = {
    findById: async (id: string) => {
        return prisma.project.findUnique({
            where: { id },
            include: { mapLocation: true },
        });
    },

    findAll: async () => {
        return prisma.project.findMany({
            include: { mapLocation: true },
        });
    },

    create: async (
        userId: string,
        data: {
            title: string;
            description: string;
            mapLocation?: {
                name: string;
                latitude: number;
                longitude: number;
                description?: string;
            };
        }
    ) => {
        return prisma.project.create({
            data: {
                title: data.title,
                description: data.description,
                owner: {
                    connect: { id: userId },
                },
                ...(data.mapLocation && {
                    mapLocation: {
                        create: data.mapLocation,
                    },
                }),
            },
            include: { mapLocation: true },
        });
    },

    update: async (id: string, data: {
        title?: string;
        description?: string;
        status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
        mapLocation?: {
            name?: string;
            latitude?: number;
            longitude?: number;
            description?: string;
        };
    }) => {
        return prisma.project.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                ...(data.mapLocation && {
                    mapLocation: {
                        upsert: {
                            create: {
                                name: data.mapLocation.name ?? "",
                                latitude: data.mapLocation.latitude ?? 0,
                                longitude: data.mapLocation.longitude ?? 0,
                                description: data.mapLocation.description,
                            },
                            update: data.mapLocation,
                        },
                    },
                }),
            },
            include: { mapLocation: true },
        });
    },

    delete: async (id: string) => {
        const project = await prisma.project.findUnique({
            where: { id },
            include: { mapLocation: true },
        });

        await prisma.project.delete({ where: { id } });

        if (project?.mapLocationId) {
            const stillUsed = await prisma.spot.findFirst({
                where: { mapLocationId: project.mapLocationId },
            });

            if (!stillUsed) {
                await prisma.mapLocation.delete({
                    where: { id: project.mapLocationId },
                });
            }
        }
    },
};