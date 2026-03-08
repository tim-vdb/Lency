import { ProjectsAction } from '../repositories/projects.action';

export const ProjectsService = {
    findByIdProject: async (id: string) => {
        return ProjectsAction.findById(id);
    },

    findAllProjects: async () => {
        return ProjectsAction.findAll();
    },

    createProject: async (
        userId: string,
        data: {
            title: string;
            description: string;
            mapLocationId: string | null;
        }
    ) => {
        return ProjectsAction.create(userId, data);
    },

    updateProject: async (
        id: string,
        data: {
            title?: string;
            description?: string;
            status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
            ownerId?: string;
            mapLocationId?: string | null;
        }
    ) => {
        return ProjectsAction.update(id, data);
    },

    deleteProject: async (id: string) => {
        return ProjectsAction.delete(id);
    },
};
