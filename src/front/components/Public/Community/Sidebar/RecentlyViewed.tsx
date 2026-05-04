"use client";

import { Bookmark, Heart, MessageCircleMore, Share } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@/front/components/ui/separator";
import type { RecentlyViewedEntry } from "@/front/stores/use-recently-viewed.store";
import type { PostWithAuthorAndCategory } from "@/front/types/post.schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/front/components/ui/card";
import Image from "next/image";
import { cn } from "@/front/lib/utils";
import PostAvatar from "../Posts/PostAvatar";

function formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
    return String(n);
}

function timeAgo(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${Math.floor(hours / 24)}j`;
}

function RecentlyViewedItem({ entry }: { entry: RecentlyViewedEntry }) {
    const router = useRouter();
    const postHref = `/community/${entry.categorySlug}/post/${entry.id}`;
    const categoryHref = `/community/${entry.categorySlug}`;

    return (
        <Card
            className="flex justify-between items-center flex-row gap-2 p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            onClick={() => router.push(postHref)}
        >
            <div className="flex flex-col gap-3">
                <CardHeader className="flex px-0">
                    <span className="text-[10px] text-neutral-400 shrink-0">{timeAgo(entry.viewedAt)}</span>
                    <span className="text-[10px] text-neutral-400 shrink-0">-</span>
                    <Link
                        href={categoryHref}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:underline shrink-0 transition-colors"
                    >
                        {entry.categorySlug}
                    </Link>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 px-0">
                    <div onClick={(e) => e.stopPropagation()}>
                        <PostAvatar
                            post={{
                                author: {
                                    image: entry.authorImage,
                                    firstname: entry.authorName.split(" ")[0] ?? null,
                                    lastname: entry.authorName.split(" ").slice(1).join(" ") || null,
                                    username: entry.authorName,
                                },
                            } as unknown as PostWithAuthorAndCategory}
                            className="p-0"
                        />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-2">
                        {entry.title}
                    </p>
                </CardContent>

                <CardFooter className="px-0">
                    <div className="flex items-center gap-2">
                        {[
                            { icon: Heart, count: entry.upvoteCount },
                            { icon: MessageCircleMore, count: entry.commentCount },
                            { icon: Bookmark },
                            { icon: Share },
                        ].map(({ icon: Icon, count }, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <Icon className="w-3.5 h-3.5 text-neutral-500" />
                                <span className="text-[10px] text-neutral-400">{count ? formatCount(count) : null}</span>
                            </div>
                        ))}
                    </div>
                </CardFooter>
            </div>
            <Image src={"/images/blog/img1.jpg"} alt={entry.title} width={500} height={500} className={cn("w-32 h-full object-cover rounded-md")} />
        </Card>
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
