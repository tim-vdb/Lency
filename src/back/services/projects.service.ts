import { ProjectLevel, RemunerationType, WorkMode } from "../generated/prisma_client";
import { ProjectsAction } from "../repositories/projects.action";
import { getUser } from "../lib/auth-session";
import { NotifyNewProject, notifyProjectStatusChanged, notifyProjectVisibilityChanged } from "../lib/ably";
import { NotificationService } from "./notifications.service";

export type CreateProjectInput = {
    title: string;
    description: string;
    bannerUrl?: string;
    projectType: string;
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

        if (project.visibility === "PRIVATE") {
            const user = await getUser();
            const isMember = user && (
                project.ownerId === user.id ||
                project.participants.some((p) => p.id === user.id)
            );
            if (!isMember) throw new Error("Forbidden");
        }

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
        if (!data.projectType) throw new Error("Project type is required");

        const project = await ProjectsAction.create(user.id, {
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

        await NotifyNewProject(user.id, project.id)

        return project;
    },

    updateProject: async (id: string, data: {
        title?: string;
        description?: string;
        status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
        bannerUrl?: string;
        projectType?: string;
        remunerationType?: RemunerationType;
        level?: ProjectLevel;
        workMode?: WorkMode;
        startDate?: string;
        roles?: string[];
        visibility?: "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY";
        city?: string;
    }) => {
        if (!data || Object.keys(data).length === 0) throw new Error("No data to update");

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const project = await ProjectsService.findByIdProject(id);
        if (project.ownerId !== user.id) throw new Error("Forbidden");

        const updatedProject = await ProjectsAction.update(id, {
            title: data.title,
            description: data.description,
            status: data.status,
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

        // Notifier tous les clients si la visibilité change
        if (data.visibility && data.visibility !== project.visibility) {
            await notifyProjectVisibilityChanged(id, data.visibility);
        }

        // Notifier les participants si le statut change
        if (data.status && data.status !== project.status) {
            const userName = user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username || "Utilisateur";
            const recipientIds = project.participants.map(p => p.id);
            for (const recipientId of recipientIds) {
                await NotificationService.createForUser(
                    recipientId, "project_status_changed",
                    `Le statut du projet "${project.title}" a changé`,
                    `${userName} a mis à jour le statut en "${data.status}"`,
                    { projectId: id, projectTitle: project.title, newStatus: data.status, changedByName: userName }
                );
            }
            await notifyProjectStatusChanged(recipientIds, id, data.status, userName);
        }

        return updatedProject;
    },

    reportProject: async (projectId: string, reason?: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const project = await ProjectsAction.findById(projectId);
        if (!project) throw new Error("Project not found");

        return ProjectsAction.reportProject(user.id, projectId, reason);
    },

    findDrafts: async () => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        return ProjectsAction.findDrafts(user.id);
    },

    deleteProject: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const project = await ProjectsService.findByIdProject(id);
        if (project.ownerId !== user.id && user.role !== "ADMIN") throw new Error("Forbidden");

        return ProjectsAction.delete(id);
    },
};
