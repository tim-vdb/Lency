import { CommentsAction } from "../repositories/comments.action";
import { getUser } from "../lib/auth-session";

export const CommentsService = {
    findByIdComment: async (id: string) => {
        const comment = await CommentsAction.findById(id);
        if (!comment) throw new Error("Comment not found");
        return comment;
    },

    findAllComments: async (postId: string) => {
        return CommentsAction.findByPostId(postId);
    },

    findByResourceId: async (resourceId: string) => {
        return CommentsAction.findByResourceId(resourceId);
    },

    createComment: async (data: {
        content: string;
        imageUrl?: string | null;
        videoUrl?: string | null;
        postId?: string;
        resourceId?: string;
        parentId?: string;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const hasContent = !!data.content && data.content.trim().length > 0;
        const hasImage = !!data.imageUrl;
        const hasVideo = !!data.videoUrl;
        if (!hasContent && !hasImage && !hasVideo) throw new Error("Content is required");

        const hasPost = !!data.postId;
        const hasResource = !!data.resourceId;
        if (hasPost === hasResource) {
            throw new Error("Target is required");
        }

        return CommentsAction.create(user.id, data);
    },

    voteComment: async (
        id: string,
        prev: "upvote" | "downvote" | null,
        next: "upvote" | "downvote" | null,
    ) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        return CommentsAction.voteUpdate(id, prev, next);
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
