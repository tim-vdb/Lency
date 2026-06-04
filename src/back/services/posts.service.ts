import { PostsAction } from "../repositories/posts.action";
import { CategoryNotificationsAction } from "../repositories/category-notifications.action";
import { notifyCategoryFeedUpdate, notifyCategoryNewContent } from "../lib/ably";
import { NotificationService } from "./notifications.service";
import { getUser } from "../lib/auth-session";

export const PostsService = {
    findByIdPost: async (id: string) => {
        const user = await getUser();
        const post = await PostsAction.findById(id, user?.id ?? undefined);
        if (!post) throw new Error("Post not found");
        return post;
    },

    findSavedPosts: async () => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        return PostsAction.findSaved(user.id);
    },

    findAllPosts: async (authorId?: string) => {
        const user = await getUser();
        return PostsAction.findAll(user?.id ?? undefined, authorId);
    },

    createPost: async (data: {
        content: string;
        categoryId: string;
        format?: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO";
        orientation?: "LANDSCAPE" | "PORTRAIT";
        imageUrl?: string;
        videoUrl?: string;
        audioUrl?: string;
        isPublished?: boolean;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        if (!data.content) throw new Error("Content is required");
        if (!data.categoryId) throw new Error("Category is required");

        const post = await PostsAction.create(user.id, data);

        if (data.isPublished) {
            // Invalide le cache de tous les viewers de la catégorie, pas seulement les abonnés notifs
            notifyCategoryFeedUpdate(data.categoryId, post.id).catch(() => {});

            // Fire-and-forget : notifs DB + Ably pour les abonnés bell uniquement
            (async () => {
                try {
                    const subscriberIds = await CategoryNotificationsAction.findSubscriberIds(data.categoryId);
                    const eligible = subscriberIds.filter((id) => id !== user.id);
                    if (eligible.length === 0) return;
                    const authorName = user.firstname && user.lastname
                        ? `${user.firstname} ${user.lastname}`
                        : user.username ?? "Quelqu'un";
                    const categoryName = post.category?.name ?? "";
                    const categorySlug = post.category?.slug ?? "";
                    await Promise.all([
                        notifyCategoryNewContent(eligible, data.categoryId, categoryName, "post", post.id, authorName),
                        ...eligible.map((uid) =>
                            NotificationService.createForUser(
                                uid,
                                "category_new_post",
                                `Nouveau post dans ${categoryName}`,
                                `${authorName} a publié un nouveau post.`,
                                { postId: post.id, categoryId: data.categoryId, categoryName, categorySlug }
                            )
                        ),
                    ]);
                } catch (err) {
                    console.error("[CategoryNotify] post:", err);
                }
            })();
        }

        return post;
    },

    updatePost: async (id: string, data: {
        content?: string;
        isPublished?: boolean;
        isLocked?: boolean;
        categoryId?: string;
        imageUrl?: string;
        videoUrl?: string;
        audioUrl?: string;
    }) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const post = await PostsService.findByIdPost(id);
        if (post.authorId !== user.id) {
            throw new Error("Forbidden");
        }

        return PostsAction.update(id, data);
    },

    deletePost: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const post = await PostsService.findByIdPost(id);
        if (post.authorId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return PostsAction.delete(id);
    },

    toggleSavePost: async (postId: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        await PostsService.findByIdPost(postId);
        return PostsAction.toggleSave(user.id, postId);
    },

    toggleVotePost: async (postId: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        await PostsService.findByIdPost(postId);
        return PostsAction.toggleVote(user.id, postId);
    },

    reportPost: async (postId: string, reason?: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        await PostsService.findByIdPost(postId);
        return PostsAction.reportPost(user.id, postId, reason);
    },

    validateIds: async (ids: string[]): Promise<string[]> => {
        if (!Array.isArray(ids) || ids.length === 0) return [];
        return PostsAction.findExistingIds(ids);
    },
};