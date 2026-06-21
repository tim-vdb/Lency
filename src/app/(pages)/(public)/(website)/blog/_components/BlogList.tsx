"use client"

import { useState } from "react"
import { cn } from "@/front/lib/utils"
import { type Blog } from "@/front/lib/api/blogs"
import { BlogCard } from "./BlogCard"

interface BlogListProps {
    blogs: Blog[]
    isAdmin: boolean
}

export default function BlogList({ blogs, isAdmin }: BlogListProps) {
    const [activeTag, setActiveTag] = useState<string | "ALL">("ALL")

    const allTags = [...new Set(blogs.flatMap(b => b.tags))]

    const filtered = activeTag === "ALL"
        ? blogs
        : blogs.filter(b => b.tags.includes(activeTag))

    return (
        <div className="flex flex-col gap-8">

            {/* ── Filtres ── */}
            {allTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setActiveTag("ALL")}
                        className={cn(
                            "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                            activeTag === "ALL"
                                ? "bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white"
                                : "border-gray-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-gray-400 dark:hover:border-neutral-600"
                        )}
                    >
                        Tous
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={cn(
                                "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                                activeTag === tag
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white"
                                    : "border-gray-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-gray-400 dark:hover:border-neutral-600"
                            )}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Grille ── */}
            {filtered.length === 0 ? (
                <p className="text-neutral-400 dark:text-neutral-500 text-sm">Aucun article pour le moment.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} isAdmin={isAdmin} />
                    ))}
                </div>
            )}
        </div>
    )
}
