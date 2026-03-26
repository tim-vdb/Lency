import { ArticlesAction } from "../repositories/articles.action";
import { getUser } from "../lib/auth-session";

export const ArticlesService = {
    findByIdArticle: async (id: string) => {
        const article = await ArticlesAction.findById(id);
        if (!article) throw new Error("Article not found");
        return article;
    },

    findAllArticles: async () => {
        return ArticlesAction.findAll();
    },

    createArticle: async (data: {
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        image: string;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        if (!data.title) throw new Error("Title is required");
        if (!data.slug) throw new Error("Slug is required");
        if (!data.content) throw new Error("Content is required");

        return ArticlesAction.create(user.id, data);
    },

    updateArticle: async (
        id: string,
        data: {
            title?: string;
            slug?: string;
            excerpt?: string;
            content?: string;
            image?: string;
        }
    ) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        if (data.title && data.title.length < 3) {
            throw new Error("Title too short");
        }

        if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
            throw new Error("Invalid slug");
        }

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const article = await ArticlesService.findByIdArticle(id);
        if (article.authorId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return ArticlesAction.update(id, data);
    },

    deleteArticle: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const article = await ArticlesService.findByIdArticle(id);
        if (article.authorId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return ArticlesAction.delete(id);
    },
};