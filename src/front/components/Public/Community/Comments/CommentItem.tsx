"use client";

import { CommentMediaUploader, type CommentMedia } from "@/front/components/common/CommentMediaUploader";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useCreateComment, useVoteComment } from "@/front/queries/posts";
import { useCreateResourceComment, useVoteResourceComment } from "@/front/queries/resources";
import { useCreateProjectComment } from "@/front/queries/projects";
import { cn, timeAgo } from "@/front/lib/utils";
import { CommentTarget } from "@/front/schemas/types/comment-target.type";
import { CreateCommentSchema, type CreateCommentFormValues } from "@/front/schemas/zod/comment.zod";
import { CommentBase, CommentWithChildren } from "@/front/schemas/types/post.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Music, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

function CommentRow({ comment, target }: { comment: CommentBase; target: CommentTarget }) {
    const requireAuth = useRequireAuth();
    const [isAnswering, setIsAnswering] = React.useState(false);
    const [userVote, setUserVote] = React.useState<"upvote" | "downvote" | null>(null);
    const [localUpvoteCount, setLocalUpvoteCount] = React.useState(comment.upvoteCount);

    const [prevServerCount, setPrevServerCount] = React.useState(comment.upvoteCount);
    if (comment.upvoteCount !== prevServerCount) {
        setPrevServerCount(comment.upvoteCount);
        setLocalUpvoteCount(comment.upvoteCount);
    }

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
            if (type === "upvote") setLocalUpvoteCount(c => c + (next === "upvote" ? 1 : -1));
            if (target.type === "post") {
                postVote.mutate({ commentId: comment.id, postId: target.id, prev, next });
            } else {
                resourceVote.mutate({ commentId: comment.id, resourceId: target.id, prev, next });
            }
        });
    }

    function handleToggleAnswering() {
        if (isAnswering) { setIsAnswering(false); return; }
        requireAuth(() => setIsAnswering(true));
    }

    const { author } = comment;
    const displayName = author.firstname && author.lastname
        ? `${author.firstname} ${author.lastname}`
        : author.username ?? "Anonyme";
    const initials = [author.firstname?.[0], author.lastname?.[0]]
        .filter(Boolean).join("").toUpperCase() || "?";

    const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } =
        useForm<CreateCommentFormValues>({
            resolver: zodResolver(CreateCommentSchema),
            defaultValues: { content: "", imageUrls: [], videoUrls: [], audioUrls: [] },
        });

    const replyMedia: CommentMedia = {
        imageUrls: watch("imageUrls"),
        videoUrls: watch("videoUrls"),
        audioUrls: watch("audioUrls"),
    };

    function onSubmit(values: CreateCommentFormValues) {
        requireAuth(() => {
            const onSuccess = () => {
                toast.success("Réponse publiée.");
                reset({ content: "", imageUrls: [], videoUrls: [], audioUrls: [] });
                setIsAnswering(false);
            };
            const onError = (error: unknown) => {
                toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
            };
            const payload = {
                content: values.content,
                parentId: comment.id,
                imageUrls: values.imageUrls,
                videoUrls: values.videoUrls,
                audioUrls: values.audioUrls,
            };
            if (target.type === "post") {
                postCreate.mutate({ ...payload, postId: target.id }, { onSuccess, onError });
            } else if (target.type === "resource") {
                resourceCreate.mutate({ ...payload, resourceId: target.id }, { onSuccess, onError });
            } else {
                projectCreate.mutate({ ...payload, projectId: target.id }, { onSuccess, onError });
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

                {comment.content && <p className="text-sm text-neutral-700">{comment.content}</p>}

                {/* Médias du commentaire */}
                {(comment.imageUrls?.length > 0 || comment.videoUrls?.length > 0 || comment.audioUrls?.length > 0) && (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {comment.imageUrls?.map((url) => (
                            <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-block">
                                <Image src={url} alt="Pièce jointe" width={320} height={240}
                                    className="rounded-md object-cover border border-neutral-200 max-h-64 w-auto" />
                            </a>
                        ))}
                        {comment.videoUrls?.map((url) => (
                            <video key={url} src={url} controls
                                className="rounded-md border border-neutral-200 max-h-64 w-auto" />
                        ))}
                        {comment.audioUrls?.map((url) => (
                            <div key={url} className="flex items-center gap-2 rounded-lg bg-neutral-100 border border-neutral-200 px-3 py-2">
                                <Music className="w-4 h-4 text-neutral-400 shrink-0" />
                                <audio src={url} controls className="h-8 max-w-[200px]" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col items-start gap-3 mt-1">
                    <div className="flex items-center gap-2">
                        <button onClick={handleToggleAnswering}
                            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">
                            {isAnswering ? "Annuler" : "Répondre"}
                        </button>
                        <div className="flex items-center gap-3">
                            <button onClick={() => handleVote("upvote")}
                                className="flex items-center gap-1 text-xs transition-colors cursor-pointer">
                                <span className={cn(userVote === "upvote" ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                                    {localUpvoteCount > 0 ? localUpvoteCount : null}
                                </span>
                                <ThumbsUp className={cn("w-3.5 h-3.5", userVote === "upvote" ? "text-neutral-700" : "text-neutral-400 hover:text-neutral-700")} />
                            </button>
                            <button onClick={() => handleVote("downvote")}
                                className="flex items-center gap-1 text-xs transition-colors cursor-pointer">
                                <ThumbsDown className={cn("w-3.5 h-3.5", userVote === "downvote" ? "text-neutral-700" : "text-neutral-400 hover:text-neutral-700")} />
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
                                <button type="submit" disabled={isPending} hidden>
                                    {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                                </button>
                            </div>
                            <Controller
                                control={control}
                                name="imageUrls"
                                render={() => (
                                    <CommentMediaUploader
                                        value={replyMedia}
                                        onChange={(val) => {
                                            setValue("imageUrls", val.imageUrls, { shouldValidate: true });
                                            setValue("videoUrls", val.videoUrls, { shouldValidate: true });
                                            setValue("audioUrls", val.audioUrls, { shouldValidate: true });
                                        }}
                                        disabled={isPending}
                                    />
                                )}
                            />
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
