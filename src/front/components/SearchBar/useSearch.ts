"use client";

import { useState, useRef, useDeferredValue, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";
import { useQueryState, parseAsString } from "nuqs";
import { fetchSearchResults, type SearchResults } from "@/front/lib/api/search";
import type { FilterKey } from "./SearchBar.constants";

export function useSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const deferredQuery = useDeferredValue(query);

    const [sType, setSType] = useQueryState("sType", parseAsString.withDefault(""));

    useHotkeys(
        "meta+k, ctrl+k",
        (e) => { e.preventDefault(); setOpen(true); },
        { enableOnFormTags: true }
    );

    useEffect(() => {
        if (open) {
            const id = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(id);
        }
    }, [open]);

    const { data, isLoading } = useQuery<SearchResults>({
        queryKey: ["search", deferredQuery],
        queryFn: () => fetchSearchResults(deferredQuery),
        enabled: open,
        staleTime: 1000 * 30,
    });

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
        if (!nextOpen) {
            setQuery("");
            setSType(null);
        }
    }

    // Fermeture déclenchée par un clic sur un lien — ne touche pas à sType
    // pour éviter le conflit entre router.replace (Nuqs) et router.push (Link)
    function closeForNavigation() {
        setOpen(false);
        setQuery("");
    }

    const counts = {
        projects: data?.projects.length ?? 0,
        categories: data?.categories.length ?? 0,
        posts: data?.posts.length ?? 0,
        resources: data?.resources.length ?? 0,
    };
    const total = counts.projects + counts.categories + counts.posts + counts.resources;
    const hasResults = total > 0;
    const isEmpty = !isLoading && !!data && !hasResults;
    const show = (key: Exclude<FilterKey, "">) => !sType || sType === key;

    return {
        open,
        handleOpenChange,
        closeForNavigation,
        query,
        setQuery,
        inputRef,
        sType,
        setSType,
        data,
        isLoading,
        counts,
        total,
        hasResults,
        isEmpty,
        show,
    };
}
