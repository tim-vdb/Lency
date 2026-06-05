"use client"

import { useState } from "react"
import { cn } from "@/front/lib/utils"
import { BLOG_TAGS, type Blog, type BlogTag } from "@/front/lib/api/blogs"
import { BlogCard } from "./BlogCard"

interface BlogListProps {
    blogs: Blog[]
    isAdmin: boolean
}

export default function BlogList({ blogs, isAdmin }: BlogListProps) {
    const [activeTag, setActiveTag] = useState<BlogTag | "ALL">("ALL")

    const filtered = activeTag === "ALL"
        ? blogs
        : blogs.filter((b) => b.tag === activeTag)

    return (
        <div className="flex flex-col gap-8">

            {/* ── Filtres ── */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => setActiveTag("ALL")}
                    className={cn(
                        "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                        activeTag === "ALL"
                            ? "bg-gray-900 text-white border-gray-900"
                            : "border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400"
                    )}
                >
                    Tous
                </button>
                {BLOG_TAGS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setActiveTag(value)}
                        className={cn(
                            "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                            activeTag === value
                                ? "bg-gray-900 text-white border-gray-900"
                                : "border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Grille ── */}
            {filtered.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun article pour le moment.</p>
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
