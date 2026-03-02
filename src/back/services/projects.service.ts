import { PostsAction } from "../repositories/posts.action";


export const PostsService = {
    findById: async (id: string) => {
        return PostsAction.findById(id);
    },

    findAll: async () => {
        return PostsAction.findAll();
    },

    create: async (userId: string, data: { title: string, content: string, categoryId: string }) => {
        return PostsAction.create(userId, data);
    },

    update: async (id: string, data: { title?: string, content?: string, categoryId?: string }) => {
        return PostsAction.update(id, data);
    },

    delete: async (id: string) => {
        return PostsAction.delete(id);
    },
}