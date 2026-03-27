import { CommentsAction } from "../repositories/comments.action";
import { getUser } from "../lib/auth-session";

export const CommentsService = {
    findByIdComment: async (id: string) => {
        const comment = await CommentsAction.findById(id);
        if (!comment) throw new Error("Comment not found");
        return comment;
    },

    findAllComments: async () => {
        return CommentsAction.findAll();
    },

    createComment: async (data: {
        content: string;
        postId: string;
        parentId?: string;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        if (!data.content) throw new Error("Content is required");
        if (!data.postId) throw new Error("Post is required");

        return CommentsAction.create(user.id, data);
    },

    updateComment: async (id: string, data: { content: string }) => {
        if (!data.content) throw new Error("Content is required");

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const comment = await CommentsService.findByIdComment(id);
        if (comment.authorId !== user.id) {
            throw new Error("Forbidden");
        }

        return CommentsAction.update(id, data);
    },

    deleteComment: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const comment = await CommentsService.findByIdComment(id);
        if (comment.authorId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return CommentsAction.delete(id);
    },
};