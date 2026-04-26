"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PostWithUserState } from "@/front/types/post.schema";

export interface RecentlyViewedEntry {
    id: string;
    title: string;
    content: string;
    categorySlug: string;
    authorName: string;
    authorImage: string | null;
    upvoteCount: number;
    commentCount: number;
    saveCount: number;
    viewedAt: string;
}

interface RecentlyViewedStore {
    entries: RecentlyViewedEntry[];
    add: (post: PostWithUserState) => void;
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
                    title: post.title,
                    content: post.content,
                    categorySlug: post.category.slug,
                    authorName,
                    authorImage: author.image ?? null,
                    upvoteCount: post.upvoteCount,
                    commentCount: post.commentCount,
                    saveCount: post.saveCount,
                    viewedAt: new Date().toISOString(),
                };

                set((state) => ({
                    entries: [entry, ...state.entries.filter((e) => e.id !== post.id)].slice(0, 10),
                }));
            },
            clear: () => set({ entries: [] }),
        }),
        { name: "lency:recently-viewed" }
    )
);
