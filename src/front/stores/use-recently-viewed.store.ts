"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PostWithUserState } from "@/front/types/post.schema";

export interface RecentlyViewedEntry {
    id: string;
    content: string;
    categorySlug: string;
    authorName: string;
    authorUsername: string | null;
    authorImage: string | null;
    imageUrl: string | null;
    upvoteCount: number;
    commentCount: number;
    saveCount: number;
    viewedAt: string;
}

type CountUpdates = Pick<RecentlyViewedEntry, "upvoteCount" | "commentCount" | "saveCount">;

interface RecentlyViewedStore {
    entries: RecentlyViewedEntry[];
    add: (post: PostWithUserState) => void;
    syncCounts: (postId: string, counts: CountUpdates) => void;
    clear: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedStore>()(
    persist(
        (set) => ({
            entries: [],
            add: (post) => {
                const author = post.author;
                const authorName =
                    author.firstname && author.lastname
                        ? `${author.firstname} ${author.lastname}`
                        : author.username ?? "Anonyme";

                const entry: RecentlyViewedEntry = {
                    id: post.id,
                    content: post.content,
                    categorySlug: post.category.slug,
                    authorName,
                    authorUsername: author.username ?? null,
                    authorImage: author.image ?? null,
                    imageUrl: post.imageUrl ?? null,
                    upvoteCount: post.upvoteCount,
                    commentCount: post.commentCount,
                    saveCount: post.saveCount,
                    viewedAt: new Date().toISOString(),
                };

                set((state) => ({
                    entries: [entry, ...state.entries.filter((e) => e.id !== post.id)].slice(0, 10),
                }));
            },
            syncCounts: (postId, counts) =>
                set((state) => ({
                    entries: state.entries.map((e) =>
                        e.id === postId ? { ...e, ...counts } : e
                    ),
                })),
            clear: () => set({ entries: [] }),
        }),
        { name: "lency:recently-viewed" }
    )
);
