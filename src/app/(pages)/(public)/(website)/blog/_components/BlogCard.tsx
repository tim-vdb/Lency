"use client"

import { BLOG_TAGS, type Blog } from "@/front/lib/api/blogs"
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

    const tagLabel = BLOG_TAGS.find((t) => t.value === blog.tag)?.label ?? blog.tag

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
            className="group flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
            {/* Cover */}
            {blog.coverUrl ? (
                <img
                    src={blog.coverUrl}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-100" />
            )}

            <div className="flex flex-col gap-3 p-5 sm:p-6 flex-1">
                {/* Tag */}
                <span className="self-start rounded-full border border-gray-200 px-3 py-0.5 text-xs font-medium text-gray-500">
                    {tagLabel}
                </span>

                {/* Titre */}
                <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2">
                    {blog.title}
                </h2>

                {/* Extrait */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {blog.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
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
                                className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <Pencil className="size-3.5" />
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
