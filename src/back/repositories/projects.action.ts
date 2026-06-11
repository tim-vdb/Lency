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
        let mapLocationId: string | undefined;
        if (data.mapLocation?.name) {
            const loc = await prisma.mapLocation.create({
                data: {
                    name: data.mapLocation.name,
                    latitude: data.mapLocation.latitude ?? 0,
                    longitude: data.mapLocation.longitude ?? 0,
                    description: data.mapLocation.description,
                },
            });
            mapLocationId = loc.id;
        }

        const created = await prisma.project.create({
            data: {
                title: data.title!,
                description: data.description!,
                bannerUrl: data.bannerUrl,
                projectType: data.projectType ?? "AUTRE",
                remunerationType: data.remunerationType,
                level: data.level,
                workMode: data.workMode,
                startDate: data.startDate,
                status: data.status ?? "PUBLISHED",
                roles: data.roles ?? [],
                attachments: data.attachments ?? [],
                visibility: data.visibility ?? "PUBLIC",
                ownerId: userId,
                ...(mapLocationId && { mapLocationId }),
            },
        });

        return prisma.project.findUnique({
            where: { id: created.id },
            include: { owner: true, participants: true, mapLocation: true },
        });
    },

    update: async (id: string, data: ProjectWriteData) => {
        if (data.mapLocation) {
            const existing = await prisma.project.findUnique({ where: { id }, select: { mapLocationId: true } });
            if (existing?.mapLocationId) {
                await prisma.mapLocation.update({
                    where: { id: existing.mapLocationId },
                    data: data.mapLocation,
                });
            } else {
                const loc = await prisma.mapLocation.create({
                    data: {
                        name: data.mapLocation.name ?? "",
                        latitude: data.mapLocation.latitude ?? 0,
                        longitude: data.mapLocation.longitude ?? 0,
                        description: data.mapLocation.description,
                    },
                });
                await prisma.project.update({ where: { id }, data: { mapLocationId: loc.id } });
            }
        }

        await prisma.project.update({
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
            },
        });

        return prisma.project.findUnique({
            where: { id },
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
