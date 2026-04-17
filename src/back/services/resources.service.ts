import { ResourcesAction } from "../repositories/resources.action";
import { getUser } from "../lib/auth-session";

export const ResourcesService = {
    findByIdResource: async (id: string) => {
        const resource = await ResourcesAction.findById(id);
        if (!resource) throw new Error("Resource not found");
        return resource;
    },

    findAllResources: async () => {
        return ResourcesAction.findAll();
    },

    createResource: async (data: {
        title: string;
        description?: string | null;
        type: "ASSET" | "TUTORIAL" | "LINK";
        url: string;
        categoryId: string;
    }) => {
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        if (!data.title) throw new Error("Title is required");
        if (!data.url) throw new Error("URL is required");
        if (!data.type) throw new Error("Type is required");
        if (!data.categoryId) throw new Error("Category is required");

        return ResourcesAction.create(data);
    },

    updateResource: async (id: string, data: {
        title?: string;
        description?: string | null;
        type?: "ASSET" | "TUTORIAL" | "LINK";
        url?: string;
        categoryId?: string;
    }) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await ResourcesService.findByIdResource(id);

        return ResourcesAction.update(id, data);
    },

    deleteResource: async (id: string) => {
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await ResourcesService.findByIdResource(id);

        return ResourcesAction.delete(id);
    },
};