"use client";

import { Badge } from "@/front/components/ui/badge";
import { Card } from "@/front/components/ui/card";
import { ResourceWithUserState } from "@/front/types/resource.schema";
import { Heart, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


interface ResourceCardProps {
    resource: ResourceWithUserState;
    variant?: "grid" | "compact" | "large";
    isActive?: boolean;
}

export default function ResourceCard({ resource, variant = "grid" }: ResourceCardProps) {
    const router = useRouter();
    const href = `/community/${resource.category.slug}/resources/${resource.id}`;
    const categoryHref = `/community/${resource.category.slug}`;

    if (variant === "large") {
        return (
            <Card
                className="gap-0 p-0 overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => router.push(href)}
            >
                <div className="relative w-full h-44 bg-linear-to-br from-pink-100 via-pink-50 to-rose-200">
                    {resource.imageUrls?.[0] ? (
                        <Image
                            src={resource.imageUrls[0]}
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
            className="gap-3 py-6 overflow-hidden transition-shadow hover:shadow-md h-full cursor-pointer"
            onClick={() => router.push(href)}
        >
            <div className="relative mx-3 h-40 rounded-md overflow-hidden bg-linear-to-br from-pink-100 via-pink-50 to-rose-200">
                {resource.imageUrls?.[0] ? (
                    <Image
                        src={resource.imageUrls[0]}
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
                        <Badge variant="secondary" className="text-[10px] font-medium rounded-sm p-1.5">
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
