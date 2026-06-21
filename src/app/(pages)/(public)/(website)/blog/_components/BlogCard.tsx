"use client"

import { type Blog } from "@/front/lib/api/blogs"
import { useDeleteBlog } from "@/front/queries/blogs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"

interface BlogCardProps {
    blog: Blog
    isAdmin: boolean
}

export function BlogCard({ blog, isAdmin }: BlogCardProps) {
    const router = useRouter()
    const { mutate: deleteBlog, isPending } = useDeleteBlog()

    function handleDelete() {
        if (!confirm("Supprimer cet article ?")) return
        deleteBlog(blog.id, {
            onSuccess: () => toast.success("Article supprimé."),
            onError: (err) => toast.error(err instanceof Error ? err.message : "Erreur"),
        })
    }

    return (
        <div
            onClick={() => router.push(`/blog/${blog.id}`)}
            className="group flex flex-col rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
            {/* Cover */}
            {blog.coverUrl ? (
                <img
                    src={blog.coverUrl}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-100 dark:bg-neutral-700" />
            )}

            <div className="flex flex-col gap-3 p-5 sm:p-6 flex-1">
                {/* Tags */}
                {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {blog.tags.map(tag => (
                            <span
                                key={tag}
                                className="rounded-full border border-gray-200 dark:border-neutral-700 px-3 py-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Titre */}
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2">
                    {blog.title}
                </h2>

                {/* Extrait */}
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3 flex-1">
                    {blog.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-neutral-700">
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                        {new Date(blog.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>

                    {/* Actions admin */}
                    {isAdmin && (
                        <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => router.push(`/admin/blogs/${blog.id}/edit`)}
                                className="rounded-lg p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Pencil className="size-3.5" />
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="rounded-lg p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                            >
                                <Trash2 className="size-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
