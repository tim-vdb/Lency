"use client";

import { useCommentsByPostId } from "@/front/hooks/querys/use-posts";
import { CommentItem } from "./CommentItem";

interface CommentsProps {
    postId: string;
    commentCount: number;
}

export default function Comments({ postId, commentCount }: CommentsProps) {
    const { data: comments, isLoading } = useCommentsByPostId(postId);

    const count = commentCount;

    if (isLoading) return <p className="text-xs text-neutral-400">Chargement...</p>;

    return (
        <div className="w-full flex flex-col gap-6">
            <p className="text-center text-sm font-semibold">
                {count} commentaire{count !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-col gap-5">
                {comments?.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
}
