import { ArticlesAction } from "../repositories/articles.action";

export const ArticlesService = {
    findByIdArticle: async (id: string) => {
        return ArticlesAction.findById(id);
    },

    findAllArticles: async () => {
        return ArticlesAction.findAll();
    },

    createArticle: async (
        userId: string,
        data: {
            title: string;
            slug: string;
            excerpt: string;
            content: string;
            image: string;
            authorId: string;
        }
    ) => {
        return ArticlesAction.create(userId, data);
    },

    updateArticle: async (
        id: string,
        data: {
            title?: string;
            slug?: string;
            excerpt?: string;
            content?: string;
            image?: string;
            authorId?: string;
        }
    ) => {
        return ArticlesAction.update(id, data);
    },

    deleteArticle: async (id: string) => {
        return ArticlesAction.delete(id);
    },
};