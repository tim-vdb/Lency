import { PostsAction } from "../repositories/posts.action";
import { getUser } from "../lib/auth-session";

export const PostsService = {
    findByIdPost: async (id: string) => {
        const user = await getUser();
        const post = await PostsAction.findById(id, user?.id ?? undefined);
        if (!post) throw new Error("Post not found");
        return post;
    },

    findAllPosts: async () => {
        const user = await getUser();
        return PostsAction.findAll(user?.id ?? undefined);
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

        return PostsAction.create(user.id, data);
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
};