"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Badge } from "@/front/components/ui/badge";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useToggleSaveResource, useToggleVoteResource } from "@/front/hooks/queries/use-resources";
import { cn, timeAgo } from "@/front/lib/utils";
import { ResourceWithUserState } from "@/front/types/resource.schema";
import { Bookmark, ExternalLink, Heart, MessageCircleMore, Share } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";
import { useShare } from "@/front/hooks/use-share";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/front/components/ui/tooltip";

const BADGE_PALETTE = [
    "bg-blue-100 text-blue-700",
    "bg-pink-100 text-pink-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
    "bg-sky-100 text-sky-700",
    "bg-lime-100 text-lime-700",
];

function colorForSlug(slug: string) {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
    return BADGE_PALETTE[hash % BADGE_PALETTE.length];
}

export default function ResourceDetail({ resource }: { resource: ResourceWithUserState }) {
    const href = `/community/${resource.category.slug}/resources/${resource.id}`;
    const requireAuth = useRequireAuth();
    const [isVoted, setIsVoted] = useState(resource.isVoted);
    const [isSaved, setIsSaved] = useState(resource.isSaved);
    const share = useShare();
    const [upvoteCount, setUpvoteCount] = useState(resource.upvoteCount);

    const { mutate: toggleVote } = useToggleVoteResource(resource.id, resource.categoryId);
    const { mutate: toggleSave } = useToggleSaveResource(resource.id, resource.categoryId);

    const authorName = resource.author.firstname && resource.author.lastname
        ? `${resource.author.firstname} ${resource.author.lastname}`
        : resource.author.username ?? "Anonyme";
    const authorInitials = [resource.author.firstname?.[0], resource.author.lastname?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase() || "?";
    const badgeClass = colorForSlug(resource.category.slug);

    function handleVote() {
        requireAuth(() => {
            const prev = isVoted;
            setIsVoted(!prev);
            setUpvoteCount((c) => (prev ? c - 1 : c + 1));
            toggleVote(undefined, {
                onError: () => {
                    setIsVoted(prev);
                    setUpvoteCount((c) => (prev ? c + 1 : c - 1));
                },
            });
        });
    }

    function handleSave() {
        requireAuth(() => {
            const prev = isSaved;
            setIsSaved(!prev);
            toggleSave(undefined, {
                onSuccess: () => toast.success(!prev ? "Ressource enregistrée." : "Ressource retirée."),
                onError: () => setIsSaved(prev),
            });
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={resource.author.avatarUrl ?? undefined} alt={authorName} />
                    <AvatarFallback className="text-xs bg-neutral-100">{authorInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{authorName}</span>
                    <span className="text-xs text-neutral-400">{timeAgo(resource.createdAt)}</span>
                </div>
            </div>

            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-linear-to-br from-pink-100 via-pink-50 to-rose-200">
                {resource.imageUrl && (
                    <Image
                        src={resource.imageUrl}
                        alt={resource.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="object-cover"
                    />
                )}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {upvoteCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageCircleMore className="w-3 h-3" />
                        {resource.commentCount}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{resource.title}</h1>
                <Badge variant="secondary" className={cn("text-xs font-medium", badgeClass)}>
                    {resource.category.name}
                </Badge>
            </div>

            {resource.description && (
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                    {resource.description}
                </p>
            )}

            <a
                href={resource.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 underline w-fit"
            >
                <ExternalLink className="w-4 h-4" />
                {resource.url}
            </a>

            <div className="flex items-center gap-4 pt-2 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Heart className={cn("w-6 h-6 cursor-pointer hover:text-red-500", isVoted && "fill-red-500 text-red-500")} onClick={(e) => { e.stopPropagation(); handleVote(); }} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Aimer</p>
                        </TooltipContent>
                    </Tooltip>
                    <span>{upvoteCount}</span>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Bookmark className={cn("w-6 h-6 cursor-pointer transition-colors", isSaved ? "fill-neutral-900 text-neutral-900" : "")} onClick={(e) => { e.stopPropagation(); handleSave(); }} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Enregistrer</p>
                    </TooltipContent>
                </Tooltip>
                <div className="flex flex-col items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Share className="w-6 h-6 cursor-pointer" onClick={(e) => { e.stopPropagation(); share(href, resource.title); }} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Partager</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
                <CommentRoot target={{ type: "resource", id: resource.id }} />
                <Comments target={{ type: "resource", id: resource.id }} commentCount={resource.commentCount} />
            </div>
        </div>
    );
}
