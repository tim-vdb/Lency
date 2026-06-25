"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X, Folder, Tag, FileText, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/front/lib/utils";
import { useSearch } from "./useSearch";
import { SearchFilters } from "./SearchFilters";
import { SearchSection } from "./SearchSection";
import { SearchProjectCard } from "./SearchProjectCard";
import { SearchProjectItem } from "./SearchProjectItem";
import { SearchCategoryList } from "./SearchCategoryList";
import { SearchPostItem } from "./SearchPostItem";
import { SearchResourceItem } from "./SearchResourceItem";
import { SearchFooter } from "./SearchFooter";

export default function SearchBar() {
    const {
        open, handleOpenChange,
        closeForNavigation,
        query, setQuery, inputRef,
        sType, setSType,
        data, isLoading,
        counts, total, hasResults, isEmpty, show,
    } = useSearch();

    return (
        <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
            {/* Trigger dans le header */}
            <DialogPrimitive.Trigger asChild>
                <button className={cn(
                    "relative flex items-center gap-2 px-2.5 sm:px-3 h-8 rounded-lg sm:w-full",
                    "border border-neutral-200 dark:border-neutral-800",
                    "bg-white dark:bg-transparent",
                    "hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                )}>
                    <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-400 shrink-0" />
                    <span className="hidden sm:flex flex-1 text-left text-sm text-neutral-400 dark:text-zinc-400">
                        Rechercher…
                    </span>
                    <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-neutral-400 dark:text-zinc-400 font-mono shrink-0">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                {/* Overlay */}
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-150" />

                {/* Modal */}
                <DialogPrimitive.Content
                    className={cn(
                        "fixed left-1/2 top-[12vh] z-50 -translate-x-1/2",
                        "w-[calc(100vw-2rem)] max-w-[640px]",
                        "rounded-2xl overflow-hidden flex flex-col",
                        "bg-white dark:bg-neutral-950",
                        "border border-neutral-200 dark:border-neutral-800",
                        "shadow-2xl shadow-black/20 dark:shadow-black/80",
                        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-4",
                        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                        "duration-200"
                    )}
                >
                    <DialogPrimitive.Title className="sr-only">Rechercher</DialogPrimitive.Title>

                    {/* Input */}
                    <div className="flex items-center gap-3 px-4 border-b border-neutral-100 dark:border-neutral-800">
                        <Search className="w-4 h-4 text-neutral-400 dark:text-zinc-400 shrink-0" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher un projet, post, communauté…"
                            className="flex-1 py-4 bg-transparent text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-zinc-400 outline-none"
                        />
                        {query ? (
                            <button
                                onClick={() => setQuery("")}
                                className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        ) : (
                            <DialogPrimitive.Close className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400 transition-colors">
                                <X className="w-4 h-4" />
                            </DialogPrimitive.Close>
                        )}
                    </div>

                    {/* Tabs de filtres */}
                    <SearchFilters
                        data={data}
                        isLoading={isLoading}
                        sType={sType}
                        setSType={setSType}
                        counts={counts}
                        total={total}
                    />

                    {/* Zone résultats */}
                    <div className="overflow-y-auto overscroll-contain max-h-[58vh]">

                        {/* Loading */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-16">
                                <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-500 dark:border-neutral-700 dark:border-t-neutral-400 rounded-full animate-spin" />
                            </div>
                        )}

                        {/* Aucun résultat */}
                        {isEmpty && (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <Search className="w-8 h-8 text-neutral-200 dark:text-neutral-800" />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                        Aucun résultat pour &laquo;&nbsp;{query}&nbsp;&raquo;
                                    </p>
                                    <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
                                        Essayez un autre mot-clé
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isLoading && data && (
                            <div className="p-3 space-y-4">

                                {/* Mode découverte — pas de query, vue "Tout" */}
                                {!query && !sType && (
                                    <>
                                        {counts.projects > 0 && (
                                            <SearchSection
                                                icon={<Sparkles className="w-3.5 h-3.5" />}
                                                label="Nouveaux projets"
                                            >
                                                <div className="grid grid-cols-3 gap-2.5 mt-1">
                                                    {data.projects.slice(0, 6).map((project) => (
                                                        <SearchProjectCard key={project.id} project={project} onClose={closeForNavigation} />
                                                    ))}
                                                </div>
                                            </SearchSection>
                                        )}

                                        {counts.categories > 0 && (
                                            <SearchSection
                                                icon={<Tag className="w-3.5 h-3.5" />}
                                                label="Communautés populaires"
                                            >
                                                <SearchCategoryList categories={data.categories} onClose={closeForNavigation} />
                                            </SearchSection>
                                        )}

                                        {counts.posts > 0 && (
                                            <SearchSection icon={<FileText className="w-3.5 h-3.5" />} label="Posts récents">
                                                {data.posts.slice(0, 3).map((post) => (
                                                    <SearchPostItem key={post.id} post={post} onClose={closeForNavigation} />
                                                ))}
                                            </SearchSection>
                                        )}

                                        {counts.resources > 0 && (
                                            <SearchSection icon={<BookOpen className="w-3.5 h-3.5" />} label="Ressources récentes">
                                                {data.resources.slice(0, 3).map((resource) => (
                                                    <SearchResourceItem key={resource.id} resource={resource} onClose={closeForNavigation} />
                                                ))}
                                            </SearchSection>
                                        )}
                                    </>
                                )}

                                {/* Mode découverte — filtre actif sans query */}
                                {!query && sType && (
                                    <>
                                        {sType === "projects" && (
                                            <SearchSection icon={<Folder className="w-3.5 h-3.5" />} label="Nouveaux projets">
                                                <div className="grid grid-cols-3 gap-2.5 mt-1">
                                                    {data.projects.map((project) => (
                                                        <SearchProjectCard key={project.id} project={project} onClose={closeForNavigation} />
                                                    ))}
                                                </div>
                                            </SearchSection>
                                        )}
                                        {sType === "categories" && (
                                            <SearchSection icon={<Tag className="w-3.5 h-3.5" />} label="Communautés populaires">
                                                <SearchCategoryList categories={data.categories} onClose={closeForNavigation} />
                                            </SearchSection>
                                        )}
                                        {sType === "posts" && (
                                            <SearchSection icon={<FileText className="w-3.5 h-3.5" />} label="Posts récents">
                                                {data.posts.map((post) => (
                                                    <SearchPostItem key={post.id} post={post} onClose={closeForNavigation} />
                                                ))}
                                            </SearchSection>
                                        )}
                                        {sType === "resources" && (
                                            <SearchSection icon={<BookOpen className="w-3.5 h-3.5" />} label="Ressources récentes">
                                                {data.resources.map((resource) => (
                                                    <SearchResourceItem key={resource.id} resource={resource} onClose={closeForNavigation} />
                                                ))}
                                            </SearchSection>
                                        )}
                                    </>
                                )}

                                {/* Mode recherche — avec query */}
                                {query && (
                                    <>
                                        {show("projects") && counts.projects > 0 && (
                                            <SearchSection
                                                icon={<Folder className="w-3.5 h-3.5" />}
                                                label="Projets"
                                            >
                                                {data.projects.map((project) => (
                                                    <SearchProjectItem key={project.id} project={project} query={query} onClose={closeForNavigation} />
                                                ))}
                                            </SearchSection>
                                        )}

                                        {show("categories") && counts.categories > 0 && (
                                            <SearchSection icon={<Tag className="w-3.5 h-3.5" />} label="Communautés">
                                                <SearchCategoryList categories={data.categories} onClose={closeForNavigation} />
                                            </SearchSection>
                                        )}

                                        {show("posts") && counts.posts > 0 && (
                                            <SearchSection icon={<FileText className="w-3.5 h-3.5" />} label="Posts">
                                                {data.posts.map((post) => (
                                                    <SearchPostItem key={post.id} post={post} onClose={closeForNavigation} />
                                                ))}
                                            </SearchSection>
                                        )}

                                        {show("resources") && counts.resources > 0 && (
                                            <SearchSection icon={<BookOpen className="w-3.5 h-3.5" />} label="Ressources">
                                                {data.resources.map((resource) => (
                                                    <SearchResourceItem key={resource.id} resource={resource} onClose={closeForNavigation} />
                                                ))}
                                            </SearchSection>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <SearchFooter
                        isLoading={isLoading}
                        hasResults={hasResults}
                        sType={sType}
                        counts={counts}
                        total={total}
                    />
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
