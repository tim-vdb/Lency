"use client";

import { CommentBase, CommentWithAuthor } from "@/front/types/post.schema";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";

function timeAgo(date: Date | string): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds} s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} j`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} mois`;
    return `${Math.floor(months / 12)} an`;
}

function CommentRow({ comment }: { comment: CommentBase }) {
    const { author } = comment;
    const displayName = author.firstname && author.lastname
        ? `${author.firstname} ${author.lastname}`
        : author.username ?? "Anonyme";

    const initials = [author.firstname?.[0], author.lastname?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase() || "?";

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
                <div className="flex items-center gap-4 mt-1">
                    <button className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                        Répondre
                    </button>
                    <div className="flex items-center gap-3 ml-auto">
                        <button className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{comment.upvoteCount}</span>
                        </button>
                        <button className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
                            <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CommentItem({ comment }: { comment: CommentWithAuthor }) {
    return (
        <div className="flex flex-col gap-3">
            <CommentRow comment={comment} />
            {comment.children.length > 0 && (
                <div className="ml-11 flex flex-col gap-3 border-l border-neutral-200 pl-4">
                    {comment.children.map((child) => (
                        <CommentRow key={child.id} comment={child} />
                    ))}
                </div>
            )}
        </div>
    );
}
