import { PostsAction } from "../repositories/posts.action";
import { getUser } from "../lib/auth-session";

export const PostsService = {
    findByIdPost: async (id: string) => {
        const post = await PostsAction.findById(id);
        if (!post) throw new Error("Post not found");
        return post;
    },

    findAllPosts: async () => {
        return PostsAction.findAll();
    },

    createPost: async (data: {
        title: string;
        content: string;
        categoryId: string;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        if (!data.title) throw new Error("Title is required");
        if (!data.content) throw new Error("Content is required");
        if (!data.categoryId) throw new Error("Category is required");

        return PostsAction.create(user.id, data);
    },

    updatePost: async (id: string, data: {
        title?: string;
        content?: string;
        isPublished?: boolean;
        isLocked?: boolean;
        categoryId?: string;
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
};