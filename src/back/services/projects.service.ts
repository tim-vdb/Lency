import { ProjectsAction } from "../repositories/projects.action";
import { getUser } from "../lib/auth-session";

export const ProjectsService = {
    findByIdProject: async (id: string) => {
        const project = await ProjectsAction.findById(id);
        if (!project) throw new Error("Project not found");
        return project;
    },

    findAllProjects: async () => {
        return ProjectsAction.findAll();
    },

    createProject: async (data: {
        title: string;
        description: string;
        mapLocationId?: string | null;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        if (!data.title) throw new Error("Title is required");
        if (!data.description) throw new Error("Description is required");

        return ProjectsAction.create(user.id, data);
    },

    updateProject: async (id: string, data: {
        title?: string;
        description?: string;
        status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
        mapLocationId?: string | null;
    }) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const project = await ProjectsService.findByIdProject(id);
        if (project.ownerId !== user.id) {
            throw new Error("Forbidden");
        }

        return ProjectsAction.update(id, data);
    },

    deleteProject: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const project = await ProjectsService.findByIdProject(id);
        if (project.ownerId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return ProjectsAction.delete(id);
    },
};