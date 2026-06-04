"use client";

import React, { useState, useRef, useDeferredValue } from "react";
import { Search, X, Folder, Tag, FileText, BookOpen, TrendingUp, ArrowRight, Sparkles, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";
import { useQueryState, parseAsString } from "nuqs";
import * as Popover from "@radix-ui/react-popover";
import { fetchSearchResults, type SearchResults } from "@/front/lib/api/search";
import { getDisplayName } from "@/front/lib/utils";
import { cn } from "@/front/lib/utils";

const WORK_MODE_LABELS: Record<string, string> = {
    PRESENTIEL: "Présentiel",
    DISTANCIEL: "Distanciel",
    HYBRIDE: "Hybride",
};

const LEVEL_COLORS: Record<string, string> = {
    DEBUTANT: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    INTERMEDIAIRE: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    AVANCE: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

type FilterKey = "" | "projects" | "categories" | "posts" | "resources";

const FILTERS: { key: FilterKey; label: string; icon: React.ElementType }[] = [
    { key: "", label: "Tout", icon: Sparkles },
    { key: "projects", label: "Projets", icon: Folder },
    { key: "categories", label: "Catégories", icon: Tag },
    { key: "posts", label: "Posts", icon: FileText },
    { key: "resources", label: "Ressources", icon: BookOpen },
];

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const deferredQuery = useDeferredValue(query);

    const [sType, setSType] = useQueryState("sType", parseAsString.withDefault(""));

    useHotkeys(
        "meta+k, ctrl+k",
        (e) => { e.preventDefault(); inputRef.current?.focus(); setIsOpen(true); },
        { enableOnFormTags: true }
    );

    const { data, isLoading } = useQuery<SearchResults>({
        queryKey: ["search", deferredQuery],
        queryFn: () => fetchSearchResults(deferredQuery),
        enabled: isOpen,
        staleTime: 1000 * 30,
    });

    function handleOpenChange(open: boolean) {
        setIsOpen(open);
        if (!open) {
            setQuery("");
            setSType(null); // nettoie l'URL à la fermeture
        }
    }

    const counts = {
        projects: data?.projects.length ?? 0,
        categories: data?.categories.length ?? 0,
        posts: data?.posts.length ?? 0,
        resources: data?.resources.length ?? 0,
    };
    const total = counts.projects + counts.categories + counts.posts + counts.resources;

    const hasResults = total > 0;
    const isEmpty = !isLoading && data && !hasResults;
    const show = (key: Exclude<FilterKey, "">) => !sType || sType === key;

    return (
        <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
            {/* L'input du header est l'ancre — pas de doublon dans la dropdown */}
            <Popover.Anchor asChild>
                <div className={cn(
                    "relative flex items-center gap-2 px-3 h-8 rounded-lg w-full transition-all duration-200",
                    "border border-neutral-200 dark:border-neutral-800",
                    "bg-white dark:bg-transparent",
                    "focus-within:border-neutral-300 dark:focus-within:border-neutral-700"
                )}>
                    <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Rechercher…"
                        className="flex-1 min-w-0 bg-transparent text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none"
                    />
                    {query ? (
                        <button
                            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                            className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400 transition-colors shrink-0"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-neutral-400 dark:text-neutral-600 font-mono shrink-0">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    )}
                </div>
            </Popover.Anchor>

            <Popover.Portal>
                <Popover.Content
                    align="start"
                    sideOffset={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    style={{ width: "var(--radix-popover-anchor-width)" }}
                    className={cn(
                        "z-50 rounded-xl overflow-hidden",
                        "bg-white dark:bg-neutral-950",
                        "border border-neutral-200 dark:border-neutral-800",
                        "shadow-2xl shadow-black/10 dark:shadow-black/60",
                        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
                        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                        "duration-150"
                    )}
                >
                    {/* Barre de filtres — scope les résultats par type (persisté via nuqs) */}
                    {!isLoading && data && (
                        <div className="flex items-center gap-1 px-2 py-2 border-b border-neutral-100 dark:border-neutral-800/80 overflow-x-auto scrollbar-hide">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600 shrink-0 ml-1 mr-0.5" />
                            {FILTERS.map(({ key, label, icon: Icon }) => {
                                const count = key === "" ? total : counts[key];
                                const active = sType === key;
                                if (key !== "" && count === 0) return null;
                                return (
                                    <button
                                        key={key || "all"}
                                        onClick={() => setSType(key || null)}
                                        className={cn(
                                            "group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-all duration-100",
                                            active
                                                ? "bg-orange/10 text-orange border border-orange/30"
                                                : "border border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                                        )}
                                    >
                                        <Icon className="w-3 h-3" />
                                        {label}
                                        <span className={cn(
                                            "text-[10px] tabular-nums",
                                            active ? "text-orange/70" : "text-neutral-400 dark:text-neutral-600"
                                        )}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="max-h-[420px] overflow-y-auto overscroll-contain">
                        {isLoading && (
                            <div className="flex items-center justify-center py-10">
                                <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-500 dark:border-neutral-700 dark:border-t-neutral-400 rounded-full animate-spin" />
                            </div>
                        )}

                        {isEmpty && (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <Search className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
                                <p className="text-sm text-neutral-500">
                                    Aucun résultat pour &laquo;&nbsp;{query}&nbsp;&raquo;
                                </p>
                            </div>
                        )}

                        {!isLoading && data && (
                            <div className="p-2 space-y-1">
                                {show("projects") && counts.projects > 0 && (
                                    <Section
                                        icon={<Folder className="w-3.5 h-3.5" />}
                                        label={query ? "Projets" : "Projets récents"}
                                        trending={!query}
                                    >
                                        {data.projects.map((project) => (
                                            <Popover.Close asChild key={project.id}>
                                                <Link
                                                    href={`/marketplace/${project.id}`}
                                                    className="group flex items-start gap-3 px-2.5 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-100"
                                                >
                                                    {project.bannerUrl ? (
                                                        <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                                                            <Image src={project.bannerUrl} alt={project.title} width={36} height={36} className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-md bg-linear-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                                                            <Folder className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                                                            {project.title}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                            {project.level && (
                                                                <span className={cn("text-[10px] font-medium px-1.5 py-px rounded-full", LEVEL_COLORS[project.level] ?? "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400")}>
                                                                    {project.level.charAt(0) + project.level.slice(1).toLowerCase()}
                                                                </span>
                                                            )}
                                                            {project.workMode && (
                                                                <span className="text-[10px] text-neutral-500">
                                                                    {WORK_MODE_LABELS[project.workMode] ?? project.workMode}
                                                                </span>
                                                            )}
                                                            <span className="text-[10px] text-neutral-400 dark:text-neutral-600">·</span>
                                                            <span className="text-[10px] text-neutral-500 truncate">
                                                                {getDisplayName(project.owner)}
                                                            </span>
                                                        </div>
                                                        {query && project.excerpt && (
                                                            <p className="text-[10px] text-neutral-400 dark:text-neutral-600 truncate mt-0.5 italic">
                                                                {project.excerpt}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 shrink-0 mt-1 transition-colors" />
                                                </Link>
                                            </Popover.Close>
                                        ))}
                                    </Section>
                                )}

                                {show("categories") && counts.categories > 0 && (
                                    <Section
                                        icon={<Tag className="w-3.5 h-3.5" />}
                                        label={query ? "Catégories" : "Catégories populaires"}
                                        trending={!query}
                                    >
                                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 overflow-x-auto scrollbar-hide">
                                            {data.categories.map((cat) => (
                                                <Popover.Close asChild key={cat.id}>
                                                    <Link
                                                        href={`/community/${cat.slug}`}
                                                        className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-200/70 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/80 transition-all duration-100"
                                                    >
                                                        {cat.iconUrl ? (
                                                            <Image src={cat.iconUrl} alt={cat.name} width={14} height={14} className="rounded-sm" />
                                                        ) : (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                                        )}
                                                        <span className="text-xs text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors font-medium">
                                                            {cat.name}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400 dark:text-neutral-600">{cat.subscriberCount}</span>
                                                    </Link>
                                                </Popover.Close>
                                            ))}
                                        </div>
                                    </Section>
                                )}

                                {show("posts") && counts.posts > 0 && (
                                    <Section icon={<FileText className="w-3.5 h-3.5" />} label="Posts">
                                        {data.posts.map((post) => (
                                            <Popover.Close asChild key={post.id}>
                                                <Link
                                                    href={`/community/${post.category?.slug}/post/${post.id}`}
                                                    className="group flex items-start gap-3 px-2.5 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-100"
                                                >
                                                    <div className="w-9 h-9 rounded-md bg-linear-to-br from-sky-500/20 to-cyan-500/20 border border-sky-500/20 flex items-center justify-center shrink-0">
                                                        <FileText className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                                                            {post.excerpt || post.content.slice(0, 60) + (post.content.length > 60 ? "…" : "")}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className="text-[10px] text-neutral-500 truncate">{getDisplayName(post.author)}</span>
                                                            {post.category && (
                                                                <>
                                                                    <span className="text-[10px] text-neutral-300 dark:text-neutral-700">·</span>
                                                                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600 truncate">{post.category.name}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 shrink-0 mt-1 transition-colors" />
                                                </Link>
                                            </Popover.Close>
                                        ))}
                                    </Section>
                                )}

                                {show("resources") && counts.resources > 0 && (
                                    <Section icon={<BookOpen className="w-3.5 h-3.5" />} label="Ressources">
                                        {data.resources.map((resource) => (
                                            <Popover.Close asChild key={resource.id}>
                                                <Link
                                                    href={`/community/resources/${resource.id}`}
                                                    className="group flex items-start gap-3 px-2.5 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-100"
                                                >
                                                    <div className="w-9 h-9 rounded-md bg-linear-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center shrink-0">
                                                        <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                                                            {resource.title}
                                                        </p>
                                                        {(resource.excerpt || resource.description) && (
                                                            <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                                                                {resource.excerpt || resource.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 shrink-0 mt-1 transition-colors" />
                                                </Link>
                                            </Popover.Close>
                                        ))}
                                    </Section>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-3.5 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-900/40">
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                            {isLoading
                                ? "Recherche…"
                                : hasResults
                                    ? `${sType ? counts[sType as Exclude<FilterKey, "">] : total} résultat${(sType ? counts[sType as Exclude<FilterKey, "">] : total) > 1 ? "s" : ""}`
                                    : "Commencez à taper"}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 dark:text-neutral-600">
                            <span className="flex items-center gap-1">
                                <kbd className="font-mono border border-neutral-200 dark:border-neutral-800 rounded px-1 py-px">↵</kbd>
                                ouvrir
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="font-mono border border-neutral-200 dark:border-neutral-800 rounded px-1 py-px">Esc</kbd>
                                fermer
                            </span>
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

function Section({
    icon,
    label,
    trending,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    trending?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5">
                <span className="text-neutral-400 dark:text-neutral-600">{icon}</span>
                <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{label}</span>
                {trending && <TrendingUp className="w-2.5 h-2.5 text-neutral-300 dark:text-neutral-700" />}
            </div>
            {children}
        </div>
    );
}
