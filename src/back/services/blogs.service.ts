import { BlogsAction } from "../repositories/blogs.action";
import { getUser } from "../lib/auth-session";

export const BlogsService = {
    findByIdBlog: async (id: string) => {
        const blog = await BlogsAction.findById(id);
        if (!blog) throw new Error("Blog not found");
        return blog;
    },

    findAllBlogs: async () => {
        return BlogsAction.findAll();
    },

    createBlog: async (data: {
        title: string;
        content: string;
        tags: string[];
        coverUrl?: string;
        status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        if (user.role !== "ADMIN") throw new Error("Forbidden");

        if (!data.title) throw new Error("Title is required");
        if (!data.content) throw new Error("Content is required");
        if (!data.tags?.length) throw new Error("Tags are required");

        return BlogsAction.create(user.id, data);
    },

    updateBlog: async (
        id: string,
        data: {
            title?: string;
            content?: string;
            tags?: string[];
            coverUrl?: string | null;
            status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
        }
    ) => {
        if (!data || Object.keys(data).length === 0) throw new Error("No data to update");

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        if (user.role !== "ADMIN") throw new Error("Forbidden");

        await BlogsService.findByIdBlog(id);

        return BlogsAction.update(id, data);
    },

    deleteBlog: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        if (user.role !== "ADMIN") throw new Error("Forbidden");

        await BlogsService.findByIdBlog(id);

        return BlogsAction.delete(id);
    },
};
