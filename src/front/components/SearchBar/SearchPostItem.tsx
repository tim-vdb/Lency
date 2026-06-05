import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { getDisplayName } from "@/front/lib/utils";
import type { SearchResults } from "@/front/lib/api/search";

type Post = SearchResults["posts"][number];

export function SearchPostItem({ post, onClose }: { post: Post; onClose: () => void }) {
    return (
        <Link
            href={`/community/${post.category?.slug}/post/${post.id}`}
            onClick={onClose}
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
    );
}
