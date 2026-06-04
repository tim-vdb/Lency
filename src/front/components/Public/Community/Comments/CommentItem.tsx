"use client";

import ImageKitUploader from "@/front/components/common/ImageKitUploader";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useCreateComment, useVoteComment } from "@/front/queries/posts";
import { useCreateResourceComment, useVoteResourceComment } from "@/front/queries/resources";
import { useCreateProjectComment } from "@/front/queries/projects";
import { timeAgo } from "@/front/lib/utils";
import { CommentTarget } from "@/front/schemas/types/comment-target.type";
import { CreateCommentSchema, type CreateCommentFormValues } from "@/front/schemas/zod/comment.zod";
import { CommentBase, CommentWithChildren } from "@/front/schemas/types/post.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

function CommentRow({ comment, target }: { comment: CommentBase; target: CommentTarget }) {
    const requireAuth = useRequireAuth();
    const [isAnswering, setIsAnswering] = React.useState(false);
    const [userVote, setUserVote] = React.useState<"upvote" | "downvote" | null>(null);

    const postCreate = useCreateComment(target.type === "post" ? target.id : "");
    const resourceCreate = useCreateResourceComment(target.type === "resource" ? target.id : "");
    const projectCreate = useCreateProjectComment(target.type === "project" ? target.id : "");
    const postVote = useVoteComment(target.type === "post" ? target.id : "");
    const resourceVote = useVoteResourceComment(target.type === "resource" ? target.id : "");

    const isPending =
        target.type === "post" ? postCreate.isPending :
        target.type === "resource" ? resourceCreate.isPending :
        projectCreate.isPending;

    function handleVote(type: "upvote" | "downvote") {
        requireAuth(() => {
            const prev = userVote;
            const next = userVote === type ? null : type;
            setUserVote(next);
            if (target.type === "post") {
                postVote.mutate({ commentId: comment.id, postId: target.id, prev, next });
            } else {
                resourceVote.mutate({ commentId: comment.id, resourceId: target.id, prev, next });
            }
        });
    }

    function handleToggleAnswering() {
        if (isAnswering) {
            setIsAnswering(false);
            return;
        }
        requireAuth(() => setIsAnswering(true));
    }

    const { author } = comment;
    const displayName = author.firstname && author.lastname
        ? `${author.firstname} ${author.lastname}`
        : author.username ?? "Anonyme";

    const initials = [author.firstname?.[0], author.lastname?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase() || "?";

    const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } =
        useForm<CreateCommentFormValues>({
            resolver: zodResolver(CreateCommentSchema),
            defaultValues: { content: "", imageUrl: null, videoUrl: null },
        });

    const replyImageUrl = watch("imageUrl") ?? null;
    const replyVideoUrl = watch("videoUrl") ?? null;

    function onSubmit(values: CreateCommentFormValues) {
        requireAuth(() => {
            const onSuccess = () => {
                toast.success("Réponse publiée.");
                reset({ content: "", imageUrl: null, videoUrl: null });
                setIsAnswering(false);
            };
            const onError = (error: unknown) => {
                toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
            };

            if (target.type === "post") {
                postCreate.mutate(
                    { content: values.content, postId: target.id, parentId: comment.id, imageUrl: values.imageUrl, videoUrl: values.videoUrl },
                    { onSuccess, onError }
                );
            } else if (target.type === "resource") {
                resourceCreate.mutate(
                    { content: values.content, resourceId: target.id, parentId: comment.id, imageUrl: values.imageUrl, videoUrl: values.videoUrl },
                    { onSuccess, onError }
                );
            } else {
                projectCreate.mutate(
                    { content: values.content, projectId: target.id, parentId: comment.id, imageUrl: values.imageUrl, videoUrl: values.videoUrl },
                    { onSuccess, onError }
                );
            }
        });
    }

    return (
        <div className="flex gap-3">
            <Link href={`/user/${author.username}`}>
                <div className="shrink-0">
                    {author.image ? (
                        <Image src={author.image} alt={displayName} width={32} height={32} className="w-8 h-8 rounded-full" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-medium text-white">
                            {initials}
                        </div>
                    )}
                </div>
            </Link>
            <div className="flex flex-col gap-1 flex-1">
                <Link href={`/user/${author.username}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{displayName}</span>
                        <span className="text-xs text-neutral-400">{timeAgo(comment.createdAt)}</span>
                    </div>
                </Link>
                {comment.content && (
                    <p className="text-sm text-neutral-700">{comment.content}</p>
                )}
                {comment.imageUrl && (
                    <a
                        href={comment.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block"
                    >
                        <Image
                            src={comment.imageUrl}
                            alt="Pièce jointe"
                            width={320}
                            height={240}
                            className="rounded-md object-cover border border-neutral-200 max-h-64 w-auto"
                        />
                    </a>
                )}
                {comment.videoUrl && (
                    <video
                        src={comment.videoUrl}
                        controls
                        className="mt-1 rounded-md border border-neutral-200 max-h-64 w-auto"
                    />
                )}
                <div className="flex flex-col items-start gap-3 mt-1">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleToggleAnswering}
                            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                        >
                            {isAnswering ? "Annuler" : "Répondre"}
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleVote("upvote")}
                                className="flex items-center gap-1 text-xs transition-colors cursor-pointer"
                            >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>{comment.upvoteCount > 0 ? comment.upvoteCount : ""}</span>
                            </button>
                            <button
                                onClick={() => handleVote("downvote")}
                                className="flex items-center gap-1 text-xs transition-colors cursor-pointer"
                            >
                                <ThumbsDown className="w-3.5 h-3.5" />
                                <span>{comment.downvoteCount > 0 ? comment.downvoteCount : ""}</span>
                            </button>
                        </div>
                    </div>
                    {isAnswering && (
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input
                                    {...register("content")}
                                    type="text"
                                    placeholder="Écrire une réponse..."
                                    className="flex-1 text-sm border border-neutral-200 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300 transition-all"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex items-center gap-1 text-xs font-medium bg-neutral-900 text-white px-3 py-2 rounded-md hover:bg-neutral-700 transition-colors disabled:opacity-50 cursor-pointer"
                                    hidden
                                >
                                    {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                                    Envoyer
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <Controller
                                    control={control}
                                    name="imageUrl"
                                    render={() => (
                                        <ImageKitUploader
                                            kind="image"
                                            value={replyImageUrl}
                                            onChange={(url) =>
                                                setValue("imageUrl", url, { shouldValidate: true })
                                            }
                                            disabled={isPending}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="videoUrl"
                                    render={() => (
                                        <ImageKitUploader
                                            kind="video"
                                            value={replyVideoUrl}
                                            onChange={(url) =>
                                                setValue("videoUrl", url, { shouldValidate: true })
                                            }
                                            disabled={isPending}
                                        />
                                    )}
                                />
                            </div>
                            {errors.content && (
                                <p className="text-xs text-red-500">{errors.content.message}</p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export function CommentItem({ comment, target }: { comment: CommentWithChildren; target: CommentTarget }) {
    return (
        <div className="flex flex-col gap-3">
            <CommentRow comment={comment} target={target} />

            {comment.children.length > 0 && (
                <div className="ml-11 flex flex-col gap-3 border-l border-neutral-200 pl-4">
                    {comment.children.map((child) => (
                        <CommentItem key={child.id} comment={child} target={target} />
                    ))}
                </div>
            )}
        </div>
    );
}
