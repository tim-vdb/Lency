"use client";

import { useCreateComment, useVoteComment } from "@/front/hooks/querys/use-posts";
import { timeAgo } from "@/front/lib/utils";
import { CreateCommentSchema, type CreateCommentFormValues } from "@/front/types/comment.schema";
import { CommentBase, CommentWithChildren } from "@/front/types/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function CommentRow({ comment }: { comment: CommentBase }) {
    const [isAnswering, setIsAnswering] = React.useState(false);
    const [userVote, setUserVote] = React.useState<"upvote" | "downvote" | null>(null);

    const { mutate: createComment, isPending } = useCreateComment(comment.postId);
    const { mutate: vote } = useVoteComment(comment.postId);

    function handleVote(type: "upvote" | "downvote") {
        const prev = userVote;
        const next = userVote === type ? null : type; // même vote → toggle off
        setUserVote(next);
        vote({ commentId: comment.id, postId: comment.postId, prev, next });
    }

    const { author } = comment;
    const displayName = author.firstname && author.lastname
        ? `${author.firstname} ${author.lastname}`
        : author.username ?? "Anonyme";

    const initials = [author.firstname?.[0], author.lastname?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase() || "?";

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCommentFormValues>({
        resolver: zodResolver(CreateCommentSchema),
        defaultValues: { content: "" },
    });

    function onSubmit(values: CreateCommentFormValues) {
        createComment(
            { content: values.content, postId: comment.postId, parentId: comment.id },
            {
                onSuccess: () => {
                    toast.success("Réponse publiée.");
                    reset();
                    setIsAnswering(false);
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
                },
            }
        );
    }

    return (
        <div className="flex gap-3">
            <div className="shrink-0">
                {author.avatarUrl ? (
                    <Image src={author.avatarUrl} alt={displayName} width={32} height={32} className="w-8 h-8 rounded-full" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-medium text-white">
                        {initials}
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{displayName}</span>
                    <span className="text-xs text-neutral-400">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-neutral-700">{comment.content}</p>
                <div className="flex flex-col items-start gap-3 mt-1">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsAnswering(!isAnswering)}
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
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-1">
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

export function CommentItem({ comment }: { comment: CommentWithChildren }) {
    return (
        <div className="flex flex-col gap-3">
            {/* Le commentaire lui-même */}
            <CommentRow comment={comment} />

            {/* Ses enfants — chacun est un CommentItem complet qui fera pareil */}
            {comment.children.length > 0 && (
                <div className="ml-11 flex flex-col gap-3 border-l border-neutral-200 pl-4">
                    {comment.children.map((child) => (
                        <CommentItem key={child.id} comment={child} />
                    ))}
                </div>
            )}
        </div>
    );
}
