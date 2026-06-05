import { ResourcesAction } from "../repositories/resources.action";
import { CategoryNotificationsAction } from "../repositories/category-notifications.action";
import { notifyCategoryNewContent } from "../lib/ably";
import { NotificationService } from "./notifications.service";
import { getUser } from "../lib/auth-session";

export const ResourcesService = {
    findByIdResource: async (id: string) => {
        const user = await getUser();
        const resource = await ResourcesAction.findById(id, user?.id ?? undefined);
        if (!resource) throw new Error("Resource not found");
        return resource;
    },

    findSavedResources: async () => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        return ResourcesAction.findSaved(user.id);
    },

    findAllResources: async (opts?: { categoryId?: string; authorId?: string }) => {
        const user = await getUser();
        return ResourcesAction.findAll({ categoryId: opts?.categoryId, authorId: opts?.authorId, userId: user?.id ?? undefined });
    },

    createResource: async (data: {
        title: string;
        description?: string | null;
        type: "ASSET" | "TUTORIAL" | "LINK";
        urls?: string[];
        imageUrls?: string[];
        videoUrls?: string[];
        audioUrls?: string[];
        categoryId: string;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        if (!data.title) throw new Error("Title is required");
        if (!data.type) throw new Error("Type is required");
        if (!data.categoryId) throw new Error("Category is required");

        const resource = await ResourcesAction.create(user.id, data);

        // Fire-and-forget : n'échoue jamais la création de la ressource
        (async () => {
            try {
                const subscriberIds = await CategoryNotificationsAction.findSubscriberIds(data.categoryId);
                const eligible = subscriberIds.filter((id) => id !== user.id);
                if (eligible.length === 0) return;
                const authorName = user.firstname && user.lastname
                    ? `${user.firstname} ${user.lastname}`
                    : user.username ?? "Quelqu'un";
                const categoryName = resource.category?.name ?? "";
                const categorySlug = resource.category?.slug ?? "";
                await Promise.all([
                    notifyCategoryNewContent(eligible, data.categoryId, categoryName, "resource", resource.id, authorName),
                    ...eligible.map((uid) =>
                        NotificationService.createForUser(
                            uid,
                            "category_new_resource",
                            `Nouvelle ressource dans ${categoryName}`,
                            `${authorName} a ajouté une ressource : ${data.title}.`,
                            { resourceId: resource.id, categoryId: data.categoryId, categoryName, categorySlug }
                        )
                    ),
                ]);
            } catch (err) {
                console.error("[CategoryNotify] resource:", err);
            }
        })();

        return resource;
    },

    updateResource: async (id: string, data: {
        title?: string;
        description?: string | null;
        type?: "ASSET" | "TUTORIAL" | "LINK";
        urls?: string[];
        imageUrls?: string[];
        videoUrls?: string[];
        audioUrls?: string[];
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
