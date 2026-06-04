import { CommentsAction } from "../repositories/comments.action";
import { getUser } from "../lib/auth-session";
import {
  notifyCommentOnPost,
  notifyCommentReply,
  notifyCommentOnResource,
  notifyResourceCommentReply,
  notifyCommentOnProject,
} from "../lib/ably";
import { PostsAction } from "../repositories/posts.action";
import { ResourcesAction } from "../repositories/resources.action";
import { ProjectsAction } from "../repositories/projects.action";
import { NotificationService } from "./notifications.service";

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

    findByProjectId: async (projectId: string) => {
        return CommentsAction.findByProjectId(projectId);
    },

    createComment: async (data: {
        content: string;
        imageUrl?: string | null;
        videoUrl?: string | null;
        postId?: string;
        resourceId?: string;
        projectId?: string;
        parentId?: string;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const hasContent = !!data.content && data.content.trim().length > 0;
        const hasImage = !!data.imageUrl;
        const hasVideo = !!data.videoUrl;
        if (!hasContent && !hasImage && !hasVideo) throw new Error("Content is required");

        const targetCount = [!!data.postId, !!data.resourceId, !!data.projectId].filter(Boolean).length;
        if (targetCount !== 1) throw new Error("Target is required");

        // Pré-fetcher l'entité cible avant le create pour valider son existence
        // et éviter une FK violation cryptique de Prisma
        let post: Awaited<ReturnType<typeof PostsAction.findById>> | null = null;
        let resource: Awaited<ReturnType<typeof ResourcesAction.findById>> | null = null;
        let project: Awaited<ReturnType<typeof ProjectsAction.findById>> | null = null;

        if (data.postId) {
            post = await PostsAction.findById(data.postId);
            if (!post) throw new Error("Post not found");
        } else if (data.resourceId) {
            resource = await ResourcesAction.findById(data.resourceId);
            if (!resource) throw new Error("Resource not found");
        } else if (data.projectId) {
            project = await ProjectsAction.findById(data.projectId);
            if (!project) throw new Error("Project not found");
        }

        const comment = await CommentsAction.create(user.id, data);
        const commentAuthorName = user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username || "Utilisateur";

        const fmt = (n: number) => (n > 9 ? "9+" : String(n));

        // Notifications — séparées reply vs commentaire direct
        if (post) {
            if (data.parentId) {
                const parentComment = await CommentsAction.findById(data.parentId);
                // Pas de notif si on répond à son propre commentaire
                if (parentComment && parentComment.authorId !== user.id) {
                    const postTitle = post.content.substring(0, 60);
                    const postCategorySlug = post.category?.slug ?? "";
                    await NotificationService.upsertCommentForUser(
                        parentComment.authorId, "reply_to_comment", "postId", data.postId!,
                        (count) => ({
                            title: count > 1
                                ? `${fmt(count)} nouvelles réponses à votre commentaire`
                                : `${commentAuthorName} a répondu à votre commentaire`,
                            description: count > 1
                                ? `Sur "${postTitle}" : ${fmt(count)} nouvelles réponses`
                                : `Sur "${postTitle}" : nouvelle réponse`,
                            data: { postId: data.postId, commentId: data.parentId, replyId: comment.id, replyAuthorName: commentAuthorName, postTitle, postCategorySlug, count },
                        })
                    );
                    await notifyCommentReply(parentComment.authorId, commentAuthorName, data.postId!, data.parentId, comment.id);
                }
            } else if (post.authorId !== user.id) {
                const postTitle = post.content.substring(0, 60);
                const postCategorySlug = post.category?.slug ?? "";
                await NotificationService.upsertCommentForUser(
                    post.authorId, "comment_on_post", "postId", data.postId!,
                    (count) => ({
                        title: count > 1
                            ? `${fmt(count)} nouveaux commentaires sur votre post`
                            : `${commentAuthorName} a commenté votre post`,
                        description: count > 1
                            ? `Sur "${postTitle}" : ${fmt(count)} nouveaux commentaires`
                            : `Sur "${postTitle}" : nouveau commentaire`,
                        data: { postId: data.postId, commentId: comment.id, commentAuthorName, postTitle, postCategorySlug, count },
                    })
                );
                await notifyCommentOnPost(post.authorId, commentAuthorName, data.postId!, comment.id);
            }
        } else if (resource) {
            if (data.parentId) {
                const parentComment = await CommentsAction.findById(data.parentId);
                // Pas de notif si on répond à son propre commentaire
                if (parentComment && parentComment.authorId !== user.id) {
                    const resourceTitle = resource.title ?? "";
                    const resourceCategorySlug = resource.category?.slug ?? "";
                    await NotificationService.upsertCommentForUser(
                        parentComment.authorId, "reply_to_resource_comment", "resourceId", data.resourceId!,
                        (count) => ({
                            title: count > 1
                                ? `${fmt(count)} nouvelles réponses à votre commentaire`
                                : `${commentAuthorName} a répondu à votre commentaire`,
                            description: count > 1
                                ? `Sur "${resourceTitle}" : ${fmt(count)} nouvelles réponses`
                                : `Sur "${resourceTitle}" : nouvelle réponse`,
                            data: { resourceId: data.resourceId, commentId: data.parentId, replyId: comment.id, replyAuthorName: commentAuthorName, resourceTitle, resourceCategorySlug, count },
                        })
                    );
                    await notifyResourceCommentReply(parentComment.authorId, commentAuthorName, data.resourceId!, data.parentId, comment.id);
                }
            } else if (resource.authorId !== user.id) {
                const resourceTitle = resource.title ?? "";
                const resourceCategorySlug = resource.category?.slug ?? "";
                await NotificationService.upsertCommentForUser(
                    resource.authorId, "comment_on_resource", "resourceId", data.resourceId!,
                    (count) => ({
                        title: count > 1
                            ? `${fmt(count)} nouveaux commentaires sur votre ressource`
                            : `${commentAuthorName} a commenté votre ressource`,
                        description: count > 1
                            ? `Sur "${resourceTitle}" : ${fmt(count)} nouveaux commentaires`
                            : `Sur "${resourceTitle}" : nouveau commentaire`,
                        data: { resourceId: data.resourceId, commentId: comment.id, commentAuthorName, resourceTitle, resourceCategorySlug, count },
                    })
                );
                await notifyCommentOnResource(resource.authorId, commentAuthorName, data.resourceId!, comment.id);
            }
        } else if (project) {
            const recipientIds = [...new Set([
                project.ownerId,
                ...project.participants.map(p => p.id),
            ].filter(id => id !== user.id))];

            const projectTitle = project.title ?? "";
            for (const recipientId of recipientIds) {
                await NotificationService.upsertCommentForUser(
                    recipientId, "comment_on_project", "projectId", data.projectId!,
                    (count) => ({
                        title: count > 1
                            ? `${fmt(count)} nouveaux commentaires sur "${projectTitle}"`
                            : `${commentAuthorName} a commenté sur le projet "${projectTitle}"`,
                        description: count > 1
                            ? `${fmt(count)} nouveaux commentaires sur le projet`
                            : `Nouveau commentaire sur le projet`,
                        data: { projectId: data.projectId, projectTitle, commentId: comment.id, commentAuthorName, count },
                    })
                );
            }
            await notifyCommentOnProject(recipientIds, commentAuthorName, user.id, data.projectId!, comment.id);
        }

        return comment;
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
