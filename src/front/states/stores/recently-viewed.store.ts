"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PostWithUserState } from "@/front/schemas/types/post.type";

let currentUserId: string | null = null;

export function setRecentlyViewedUser(userId: string | null) {
    currentUserId = userId;
    if (userId) {
        useRecentlyViewed.persist.rehydrate();
    } else {
        useRecentlyViewed.setState({ entries: [] });
    }
}

const userScopedStorage = createJSONStorage(() => ({
    getItem: (name: string) => {
        if (!currentUserId) return null;
        return localStorage.getItem(`${name}:${currentUserId}`);
    },
    setItem: (name: string, value: string) => {
        if (!currentUserId) return;
        localStorage.setItem(`${name}:${currentUserId}`, value);
    },
    removeItem: (name: string) => {
        if (!currentUserId) return;
        localStorage.removeItem(`${name}:${currentUserId}`);
    },
}));

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
    purgeInvalid: () => Promise<void>;
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
            purgeInvalid: async () => {
                const ids = useRecentlyViewed.getState().entries.map((e) => e.id);
                if (ids.length === 0) return;
                try {
                    const res = await fetch("/api/posts/validate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ids }),
                    });
                    if (!res.ok) return;
                    const { validIds } = await res.json() as { validIds: string[] };
                    const validSet = new Set(validIds);
                    set((state) => ({
                        entries: state.entries.filter((e) => validSet.has(e.id)),
                    }));
                } catch {
                    // silencieux — on garde les entrées en cas d'erreur réseau
                }
            },
        }),
        { name: "lency:recently-viewed", storage: userScopedStorage }
    )
);
