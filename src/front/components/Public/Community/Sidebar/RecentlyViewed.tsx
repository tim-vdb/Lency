"use client";

import { Heart, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RecentlyViewedEntry } from "@/front/stores/use-recently-viewed.store";
import Image from "next/image";
import { Button } from "@/front/components/ui/button";
import PostAvatar from "../Posts/PostAvatar";
import { formatCount, timeAgo } from "@/front/lib/utils";

function RecentlyViewedItem({ entry }: { entry: RecentlyViewedEntry }) {
    const router = useRouter();
    const postHref = `/community/${entry.categorySlug}/post/${entry.id}`;
    const categoryHref = `/community/${entry.categorySlug}`;

    return (
        <div
            className="flex gap-2 px-2 py-2 min-h-30 cursor-pointer border-t rounded-none border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
            onClick={() => router.push(postHref)}
        >
            <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                {entry.imageUrl && (
                    <div className="flex flex-col gap-1.5">
                        <PostAvatar
                            author={{
                                image: entry.authorImage,
                                firstname: entry.authorName.split(" ")[0] ?? null,
                                lastname: entry.authorName.split(" ").slice(1).join(" ") || null,
                                username: entry.authorName,
                            }}
                            className="[&_img]:h-6 [&_img]:w-6 [&_span]:text-sm"
                        />
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-2">
                            {entry.content || <span className="italic text-neutral-400">Sans texte</span>}
                        </p>
                    </div>
                )}
                {!entry.imageUrl && (
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <PostAvatar
                                author={{
                                    image: entry.authorImage,
                                    firstname: entry.authorName.split(" ")[0] ?? null,
                                    lastname: entry.authorName.split(" ").slice(1).join(" ") || null,
                                    username: entry.authorUsername,
                                }}
                                className="[&_img]:h-6 [&_img]:w-6 [&_span]:text-sm"
                            />
                            <span className="text-[10px] text-neutral-400">{timeAgo(entry.viewedAt)}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-2">
                            {entry.content || <span className="italic text-neutral-400">Sans texte</span>}
                        </p>
                    </div>
                )}

                {entry.imageUrl && (
                    <Button asChild variant="outline" className="p-0.5 px-1 h-fit border border-black hover:bg-neutral-300 rounded-sm w-fit">
                        <Link
                            href={categoryHref}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] transition-colors truncate capitalize"
                        >
                            {entry.categorySlug}
                        </Link>
                    </Button>
                )}
                {!entry.imageUrl && (
                    <div className="flex items-center justify-between">
                        <Button asChild variant="outline" className="p-0.5 px-1 h-fit border border-black hover:bg-neutral-300 rounded-sm w-fit">
                            <Link
                                href={categoryHref}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[10px] transition-colors truncate capitalize"
                            >
                                {entry.categorySlug}
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                                <Heart className="w-2.5 h-2.5 text-neutral-400" />
                                <span className="text-[10px] text-neutral-400 tabular-nums">{formatCount(entry.upvoteCount)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageCircleMore className="w-2.5 h-2.5 text-neutral-400" />
                                <span className="text-[10px] text-neutral-400 tabular-nums">{formatCount(entry.commentCount)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {entry.imageUrl && (
                <div className="flex flex-col justify-between items-end gap-2">
                    <span className="text-[10px] text-neutral-400 translate-y-2">{timeAgo(entry.viewedAt)}</span>
                    <Image
                        src={entry.imageUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 mt-0.5"
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                            <Heart className="w-2.5 h-2.5 text-neutral-400" />
                            <span className="text-[10px] text-neutral-400 tabular-nums">{formatCount(entry.upvoteCount)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircleMore className="w-2.5 h-2.5 text-neutral-400" />
                            <span className="text-[10px] text-neutral-400 tabular-nums">{formatCount(entry.commentCount)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function RecentlyViewedSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="flex flex-col">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex gap-2 px-0 py-2 min-h-30 border-t border-neutral-200 animate-pulse">
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
                                <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
                            </div>
                            <div className="h-2.5 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
                            <div className="h-2.5 w-3/4 rounded bg-neutral-100 dark:bg-neutral-800" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-14 rounded bg-neutral-100 dark:bg-neutral-800" />
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-6 rounded bg-neutral-100 dark:bg-neutral-800" />
                                <div className="h-2.5 w-6 rounded bg-neutral-100 dark:bg-neutral-800" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface RecentlyViewedProps {
    entries: RecentlyViewedEntry[];
}

const MAX_VISIBLE = 6;

export default function RecentlyViewed({ entries }: RecentlyViewedProps) {
    if (entries.length === 0) {
        return (
            <p className="text-xs text-neutral-400 py-4 text-center">
                Aucun post visité récemment.
            </p>
        );
    }

    const displayed = entries.slice(0, MAX_VISIBLE);
    const hasMore = entries.length > MAX_VISIBLE;

    return (
        <div className="relative">
            <div className="flex flex-col gap-2">
                {displayed.map((entry) => (
                    <RecentlyViewedItem key={entry.id} entry={entry} />
                ))}
            </div>
            {hasMore && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white dark:from-card to-transparent pointer-events-none" />
            )}
        </div>
    );
}
