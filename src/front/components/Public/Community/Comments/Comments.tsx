"use client";

import { useCommentsByPostId } from "@/front/hooks/querys/use-posts";
import { useResourceComments } from "@/front/hooks/querys/use-resources";
import { CommentTarget } from "@/front/types/comment-target";
import { CommentItem } from "./CommentItem";

interface CommentsProps {
    target: CommentTarget;
    commentCount: number;
}

export default function Comments({ target, commentCount }: CommentsProps) {
    const postQuery = useCommentsByPostId(target.type === "post" ? target.id : "");
    const resourceQuery = useResourceComments(target.type === "resource" ? target.id : "");

    const { data: comments, isLoading } =
        target.type === "post" ? postQuery : resourceQuery;

    const count = commentCount;

    if (isLoading) return <p className="text-xs text-neutral-400">Chargement...</p>;

    return (
        <div className="w-full flex flex-col gap-6">
            <p className="text-center text-sm font-semibold">
                {count} commentaire{count !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-col gap-5">
                {comments?.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} target={target} />
                ))}
            </div>
        </div>
    );
}
