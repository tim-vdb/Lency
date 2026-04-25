"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Badge } from "@/front/components/ui/badge";
import { Card } from "@/front/components/ui/card";
import { cn, timeAgo } from "@/front/lib/utils";
import { ResourceWithUserState } from "@/front/types/resource.schema";
import { Heart, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

interface ResourceCardProps {
    resource: ResourceWithUserState;
    variant?: "grid" | "compact";
    isActive?: boolean;
}

export default function ResourceCard({ resource, variant = "grid", isActive }: ResourceCardProps) {
    const href = `/community/${resource.category.slug}/resources/${resource.id}`;
    const badgeClass = colorForSlug(resource.category.slug);
    const authorName = resource.author.firstname && resource.author.lastname
        ? `${resource.author.firstname} ${resource.author.lastname}`
        : resource.author.username ?? "Anonyme";
    const authorInitials = [resource.author.firstname?.[0], resource.author.lastname?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase() || "?";

    if (variant === "compact") {
        return (
            <Link href={href}>
                <Card
                    className={cn(
                        "flex-row items-center gap-3 p-2 overflow-hidden transition-colors hover:bg-neutral-50",
                        isActive && "ring-2 ring-pink-300 bg-pink-50/50"
                    )}
                >
                    <div className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden bg-linear-to-br from-pink-100 to-rose-200">
                        {resource.imageUrl && (
                            <Image
                                src={resource.imageUrl}
                                alt={resource.title}
                                fill
                                sizes="96px"
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p className="text-sm font-medium line-clamp-1">{resource.title}</p>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span>{authorName}</span>
                            <span>·</span>
                            <span>{timeAgo(resource.createdAt)}</span>
                        </div>
                    </div>
                </Card>
            </Link>
        );
    }

    return (
        <Link href={href} className="group">
            <Card className="gap-3 py-3 overflow-hidden transition-shadow group-hover:shadow-md h-full">
                <div className="relative mx-3 h-40 rounded-md overflow-hidden bg-linear-to-br from-pink-100 via-pink-50 to-rose-200">
                    {resource.imageUrl ? (
                        <Image
                            src={resource.imageUrl}
                            alt={resource.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                        />
                    ) : (
                        <div
                            className="absolute inset-0 opacity-40"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(45deg, rgba(244,114,182,0.25) 0, rgba(244,114,182,0.25) 2px, transparent 2px, transparent 8px)",
                            }}
                        />
                    )}
                </div>
                <div className="px-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={resource.author.avatarUrl ?? undefined} alt={authorName} />
                            <AvatarFallback className="text-[10px] bg-neutral-100">
                                {authorInitials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-neutral-700">{authorName}</span>
                        <span className="text-xs text-neutral-400">·</span>
                        <span className="text-xs text-neutral-400">{timeAgo(resource.createdAt)}</span>
                    </div>
                    <h3 className="text-sm font-semibold line-clamp-1">{resource.title}</h3>
                    {resource.description && (
                        <p className="text-xs text-neutral-500 line-clamp-1">{resource.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                        <Badge variant="secondary" className={cn("text-[10px] font-medium", badgeClass)}>
                            {resource.category.name}
                        </Badge>
                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" />
                                {resource.upvoteCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircleMore className="w-3.5 h-3.5" />
                                {resource.commentCount}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
