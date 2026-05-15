"use client";

import { Badge } from "@/front/components/ui/badge";
import { Card } from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";
import { ResourceWithUserState } from "@/front/types/resource.schema";
import { Heart, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    variant?: "grid" | "compact" | "large";
    isActive?: boolean;
}

export default function ResourceCard({ resource, variant = "grid" }: ResourceCardProps) {
    const router = useRouter();
    const href = `/community/${resource.category.slug}/resources/${resource.id}`;
    const categoryHref = `/community/${resource.category.slug}`;
    const badgeClass = colorForSlug(resource.category.slug);

    if (variant === "large") {
        return (
            <Card
                className="gap-0 p-0 overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => router.push(href)}
            >
                <div className="relative w-full h-44 bg-linear-to-br from-pink-100 via-pink-50 to-rose-200">
                    {resource.imageUrl ? (
                        <Image
                            src={resource.imageUrl}
                            alt={resource.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
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
                <div className="p-4 flex flex-col gap-2">
                    <h3 className="text-xl font-bold leading-tight line-clamp-2">{resource.title}</h3>
                    {resource.description && (
                        <p className="text-sm text-neutral-500 line-clamp-2">{resource.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                        <Link
                            href={categoryHref}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline"
                        >
                            <Badge variant="outline" className="text-xs font-medium">
                                {resource.category.name}
                            </Badge>
                        </Link>
                        <span className="text-sm text-neutral-400">
                            {resource.upvoteCount} likes&nbsp;&nbsp;{resource.commentCount} commentaires
                        </span>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            className="gap-3 py-3 overflow-hidden transition-shadow hover:shadow-md h-full cursor-pointer"
            onClick={() => router.push(href)}
        >
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
                <h3 className="text-sm font-semibold line-clamp-1">{resource.title}</h3>
                {resource.description && (
                    <p className="text-xs text-neutral-500 line-clamp-1">{resource.description}</p>
                )}
                <div className="flex items-center justify-between pt-1">
                    <Link
                        href={categoryHref}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                    >
                        <Badge variant="secondary" className={cn("text-[10px] font-medium rounded-sm p-1.5", badgeClass)}>
                            {resource.category.name}
                        </Badge>
                    </Link>
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
    );
}
