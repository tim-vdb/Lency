import { ResourcesAction } from "../repositories/resources.action";
import { getUser } from "../lib/auth-session";

export const ResourcesService = {
    findByIdResource: async (id: string) => {
        const user = await getUser();
        const resource = await ResourcesAction.findById(id, user?.id ?? undefined);
        if (!resource) throw new Error("Resource not found");
        return resource;
    },

    findAllResources: async (opts?: { categoryId?: string }) => {
        const user = await getUser();
        return ResourcesAction.findAll({ categoryId: opts?.categoryId, userId: user?.id ?? undefined });
    },

    createResource: async (data: {
        title: string;
        description?: string | null;
        type: "ASSET" | "TUTORIAL" | "LINK";
        url: string;
        imageUrl?: string | null;
        categoryId: string;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        if (!data.title) throw new Error("Title is required");
        if (!data.url) throw new Error("URL is required");
        if (!data.type) throw new Error("Type is required");
        if (!data.categoryId) throw new Error("Category is required");

        return ResourcesAction.create(user.id, data);
    },

    updateResource: async (id: string, data: {
        title?: string;
        description?: string | null;
        type?: "ASSET" | "TUTORIAL" | "LINK";
        url?: string;
        imageUrl?: string | null;
        categoryId?: string;
    }) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const resource = await ResourcesService.findByIdResource(id);
        if (resource.authorId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return ResourcesAction.update(id, data);
    },

    deleteResource: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const resource = await ResourcesService.findByIdResource(id);
        if (resource.authorId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return ResourcesAction.delete(id);
    },

    toggleSaveResource: async (resourceId: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        await ResourcesService.findByIdResource(resourceId);
        return ResourcesAction.toggleSave(user.id, resourceId);
    },

    toggleVoteResource: async (resourceId: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        await ResourcesService.findByIdResource(resourceId);
        return ResourcesAction.toggleVote(user.id, resourceId);
    },

    incrementViewCount: async (resourceId: string) => {
        return ResourcesAction.incrementViewCount(resourceId);
    },
};
