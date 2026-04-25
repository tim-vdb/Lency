"use client";

import { Bookmark, Heart, MessageCircleMore, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/front/components/ui/separator";
import type { RecentlyViewedEntry } from "@/front/stores/use-recently-viewed.store";

function formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
    return String(n);
}

function timeAgo(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}j`;
}

function RecentlyViewedItem({ entry }: { entry: RecentlyViewedEntry }) {
    const initials = entry.authorName[0]?.toUpperCase() ?? "?";

    return (
        <div className="flex flex-col gap-2 py-3">
            {/* Header: avatar + username + date */}
            <div className="flex items-center gap-2">
                {entry.authorAvatarUrl ? (
                    <Image
                        src={entry.authorAvatarUrl}
                        alt={entry.authorName}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full"
                    />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-neutral-300 dark:bg-neutral-600 flex items-center justify-center text-xs font-medium shrink-0">
                        {initials}
                    </div>
                )}
                <span className="text-xs font-medium truncate">{entry.authorName}</span>
                <span className="text-xs text-neutral-400 shrink-0">•{timeAgo(entry.viewedAt)}</span>
            </div>

            {/* Body: excerpt */}
            <Link href={`/community/${entry.categorySlug}/post/${entry.id}`} className="group">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    {entry.content}
                </p>
            </Link>

            {/* Footer: stats */}
            <div className="flex items-center gap-3">
                {[
                    { icon: Heart, count: entry.upvoteCount },
                    { icon: MessageCircleMore, count: entry.commentCount },
                    { icon: Bookmark, count: entry.saveCount },
                    { icon: Share, count: 0 },
                ].map(({ icon: Icon, count }, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <Icon className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-[10px] text-neutral-400">{formatCount(count)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface RecentlyViewedProps {
    entries: RecentlyViewedEntry[];
}

export default function RecentlyViewed({ entries }: RecentlyViewedProps) {
    if (entries.length === 0) {
        return (
            <p className="text-xs text-neutral-400 py-2 text-center">
                Aucun post visité récemment.
            </p>
        );
    }

    return (
        <div className="flex flex-col">
            {entries.map((entry, i) => (
                <div key={entry.id}>
                    <RecentlyViewedItem entry={entry} />
                    {i < entries.length - 1 && <Separator />}
                </div>
            ))}
        </div>
    );
}
