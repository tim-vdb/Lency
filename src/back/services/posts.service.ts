import { PostsAction } from "../repositories/posts.action";


export const PostsService = {
    findByIdPost: async (id: string) => {
        return PostsAction.findById(id);
    },

    findAllPosts: async () => {
        return PostsAction.findAll();
    },

    createPost: async (userId: string, data: { title: string, content: string, categoryId: string }) => {
        return PostsAction.create(userId, data);
    },

    updatePost: async (id: string, data: { title?: string, content?: string, categoryId?: string }) => {
        return PostsAction.update(id, data);
    },

    deletePost: async (id: string) => {
        return PostsAction.delete(id);
    },
}