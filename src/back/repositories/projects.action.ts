import prisma from "../lib/prisma";

export const ProjectsAction = {
    findById: async (id: string) => {
        return prisma.project.findUnique({
            where: { id },
            include: { owner: true, participants: true, mapLocation: true },
        });
    },

    findAll: async () => {
        return prisma.project.findMany({
            include: { owner: true, participants: true, mapLocation: true },
            orderBy: { createdAt: "desc" },
        });
    },

    create: async (
        userId: string,
        data: {
            title: string;
            description: string;
            bannerUrl?: string;
            projectType?: string;
            remuneration?: string;
            startDate?: Date;
            roles?: string[];
            attachments?: { name: string; url: string }[];
            visibility?: "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY";
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
                bannerUrl: data.bannerUrl,
                projectType: data.projectType,
                remuneration: data.remuneration,
                startDate: data.startDate,
                roles: data.roles ?? [],
                attachments: data.attachments ?? [],
                visibility: data.visibility ?? "PUBLIC",
                owner: { connect: { id: userId } },
                ...(data.mapLocation && {
                    mapLocation: { create: data.mapLocation },
                }),
            },
            include: { owner: true, participants: true, mapLocation: true },
        });
    },

    update: async (
        id: string,
        data: {
            title?: string;
            description?: string;
            status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
            visibility?: "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY";
            bannerUrl?: string;
            projectType?: string;
            remuneration?: string;
            startDate?: Date;
            roles?: string[];
            attachments?: { name: string; url: string }[];
            mapLocation?: {
                name?: string;
                latitude?: number;
                longitude?: number;
                description?: string;
            };
        }
    ) => {
        return prisma.project.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                visibility: data.visibility,
                bannerUrl: data.bannerUrl,
                projectType: data.projectType,
                remuneration: data.remuneration,
                startDate: data.startDate,
                roles: data.roles,
                attachments: data.attachments,
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
            include: { owner: true, participants: true, mapLocation: true },
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
                await prisma.mapLocation.delete({ where: { id: project.mapLocationId } });
            }
        }
    },
};
