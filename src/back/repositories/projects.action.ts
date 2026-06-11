import { ProjectLevel, ProjectType, RemunerationType, WorkMode } from "../generated/prisma_client";
import prisma from "../lib/prisma";

type ProjectWriteData = {
    title?: string;
    description?: string;
    status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    visibility?: "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY";
    bannerUrl?: string;
    projectType?: ProjectType;
    remunerationType?: RemunerationType;
    level?: ProjectLevel;
    workMode?: WorkMode;
    startDate?: Date;
    roles?: string[];
    attachments?: { name: string; url: string }[];
    mapLocation?: {
        name?: string;
        latitude?: number;
        longitude?: number;
        description?: string;
    };
};

export const ProjectsAction = {
    findById: async (id: string) => {
        return prisma.project.findUnique({
            where: { id },
            include: { owner: true, participants: true, mapLocation: true },
        });
    },

    findAll: async () => {
        return prisma.project.findMany({
            where: { visibility: { not: "PRIVATE" } },
            include: { owner: true, participants: true, mapLocation: true },
            orderBy: { createdAt: "desc" },
        });
    },

    create: async (userId: string, data: Required<Pick<ProjectWriteData, "title" | "description">> & Omit<ProjectWriteData, "title" | "description">) => {
        return prisma.project.create({
            data: {
                title: data.title!,
                description: data.description!,
                bannerUrl: data.bannerUrl,
                projectType: data.projectType,
                remunerationType: data.remunerationType,
                level: data.level,
                workMode: data.workMode,
                startDate: data.startDate,
                roles: data.roles ?? [],
                attachments: data.attachments ?? [],
                visibility: data.visibility ?? "PUBLIC",
                owner: { connect: { id: userId } },
                ...(data.mapLocation?.name && {
                    mapLocation: {
                        create: {
                            name: data.mapLocation.name,
                            latitude: data.mapLocation.latitude ?? 0,
                            longitude: data.mapLocation.longitude ?? 0,
                            description: data.mapLocation.description,
                        },
                    },
                }),
            },
            include: { owner: true, participants: true, mapLocation: true },
        });
    },

    update: async (id: string, data: ProjectWriteData) => {
        return prisma.project.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                visibility: data.visibility,
                bannerUrl: data.bannerUrl,
                projectType: data.projectType,
                remunerationType: data.remunerationType,
                level: data.level,
                workMode: data.workMode,
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

    reportProject: async (userId: string, projectId: string, reason?: string) => {
        return prisma.projectReport.upsert({
            where: { userId_projectId: { userId, projectId } },
            create: { userId, projectId, reason },
            update: { reason },
        });
    },

    findByUser: async (userId: string) => {
        return prisma.project.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { participants: { some: { id: userId } } },
                ],
                status: { not: "ARCHIVED" },
            },
            select: { id: true, title: true, ownerId: true },
            orderBy: { updatedAt: "desc" },
        });
    },

    findDrafts: async (userId: string) => {
        return prisma.project.findMany({
            where: { ownerId: userId, status: "DRAFT" },
            include: { owner: true, participants: true, mapLocation: true },
            orderBy: { updatedAt: "desc" },
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
