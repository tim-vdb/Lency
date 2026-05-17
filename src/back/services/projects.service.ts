import { ProjectLevel, RemunerationType, WorkMode } from "../generated/prisma_client";
import { ProjectsAction } from "../repositories/projects.action";
import { getUser } from "../lib/auth-session";

export type CreateProjectInput = {
    title: string;
    description: string;
    bannerUrl?: string;
    projectType?: string;
    remunerationType?: RemunerationType;
    level?: ProjectLevel;
    workMode?: WorkMode;
    startDate?: string;
    roles?: string[];
    visibility?: "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY";
    city?: string;
};

export const ProjectsService = {
    findByIdProject: async (id: string) => {
        const project = await ProjectsAction.findById(id);
        if (!project) throw new Error("Project not found");
        return project;
    },

    findAllProjects: async () => {
        return ProjectsAction.findAll();
    },

    createProject: async (data: CreateProjectInput) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        if (!data.title) throw new Error("Title is required");
        if (!data.description) throw new Error("Description is required");

        return ProjectsAction.create(user.id, {
            title: data.title,
            description: data.description,
            bannerUrl: data.bannerUrl,
            projectType: data.projectType,
            remunerationType: data.remunerationType,
            level: data.level,
            workMode: data.workMode,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            roles: data.roles,
            visibility: data.visibility,
            ...(data.city && {
                mapLocation: { name: data.city, latitude: 0, longitude: 0 },
            }),
        });
    },

    updateProject: async (id: string, data: {
        title?: string;
        description?: string;
        status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    }) => {
        if (!data || Object.keys(data).length === 0) throw new Error("No data to update");

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const project = await ProjectsService.findByIdProject(id);
        if (project.ownerId !== user.id) throw new Error("Forbidden");

        return ProjectsAction.update(id, data);
    },

    deleteProject: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const project = await ProjectsService.findByIdProject(id);
        if (project.ownerId !== user.id && user.role !== "ADMIN") throw new Error("Forbidden");

        return ProjectsAction.delete(id);
    },
};
