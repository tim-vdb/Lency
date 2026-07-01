import type { ProjectLevel, ProjectType, RemunerationType, Visibility, WorkMode } from "@/back/generated/prisma_client";

export type CreateProjectInput = {
    title: string;
    description: string;
    bannerUrl?: string;
    projectType: ProjectType;
    remunerationType?: RemunerationType;
    level?: ProjectLevel;
    workMode?: WorkMode;
    startDate?: string;
    roles?: string[];
    visibility?: Visibility;
    status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    city?: string;
    latitude?: number;
    longitude?: number;
};
