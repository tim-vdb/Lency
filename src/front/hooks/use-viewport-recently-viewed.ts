"use client";

import { useEffect, useRef } from "react";
import { useRecentlyViewed } from "@/front/states/stores/recently-viewed.store";
import type { PostWithUserState } from "@/front/schemas/types/post.type";

export function useViewportRecentlyViewed(post: PostWithUserState, delayMs: number) {
    const add = useRecentlyViewed((s) => s.add);
    const ref = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const addRef = useRef(add);
    const postRef = useRef(post);

    useEffect(() => { addRef.current = add; }, [add]);
    useEffect(() => { postRef.current = post; }, [post]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    timerRef.current = setTimeout(() => addRef.current(postRef.current), delayMs);
                } else {
                    if (timerRef.current) {
                        clearTimeout(timerRef.current);
                        timerRef.current = null;
                    }
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => {
            observer.disconnect();
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [delayMs]);

    return ref;
}
