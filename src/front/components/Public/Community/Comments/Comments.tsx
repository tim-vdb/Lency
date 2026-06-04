"use client";

import { useCommentsByPostId } from "@/front/hooks/queries/use-posts";
import { useResourceComments } from "@/front/hooks/queries/use-resources";
import { useProjectComments } from "@/front/hooks/queries/use-projects";
import { CommentTarget } from "@/front/types/comment-target";
import { Skeleton } from "@/front/components/ui/skeleton";
import { CommentItem } from "./CommentItem";

interface CommentsProps {
    target: CommentTarget;
}

function CommentSkeleton() {
    return (
        <div className="flex gap-2.5">
            <Skeleton className="w-7 h-7 rounded-full shrink-0 mt-0.5" />
            <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-2.5 w-24 rounded-md" />
                <Skeleton className="h-2.5 w-full rounded-md" />
                <Skeleton className="h-2.5 w-3/4 rounded-md" />
            </div>
        </div>
    );
}

export default function Comments({ target }: CommentsProps) {
    const postQuery = useCommentsByPostId(target.type === "post" ? target.id : "");
    const resourceQuery = useResourceComments(target.type === "resource" ? target.id : "");
    const projectQuery = useProjectComments(target.type === "project" ? target.id : "");

    const { data: comments, isLoading, isError } =
        target.type === "post" ? postQuery : target.type === "resource" ? resourceQuery : projectQuery;

    if (isLoading) {
        return (
            <div className="flex flex-col gap-5">
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
            </div>
        );
    }

    if (isError) {
        return (
            <p className="text-sm text-neutral-400 text-center py-2">
                Impossible de charger les commentaires.
            </p>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-5">
                {comments?.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} target={target} />
                ))}
            </div>
        </div>
    );
}
