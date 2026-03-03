import { create } from "domain";
import { CommentsAction } from "../repositories/comments.action";

export const CommentsService = {
    findByIdComment: async (postId: string) => {
        return CommentsAction.findById(postId);
    },

    findAllComments: async () => {
        return CommentsAction.findAll();
    },

    createComment: async (userId: string, data: { content: string, postId: string, authorId: string, parentId?: string, upvoteCount: number }) => {
        return CommentsAction.create(userId, data);
    },

    updateComment: async (id: string, data: { content: string, postId: string, authorId: string, parentId?: string, upvoteCount: number }) => {
        return CommentsAction.update(id, data);
    },

    deleteComment: async (id: string) => {
        return CommentsAction.delete(id);
    },
}