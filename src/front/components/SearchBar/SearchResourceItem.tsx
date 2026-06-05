import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import type { SearchResults } from "@/front/lib/api/search";

type Resource = SearchResults["resources"][number];

export function SearchResourceItem({ resource, onClose }: { resource: Resource; onClose: () => void }) {
    return (
        <Link
            href={`/community/resources/${resource.id}`}
            onClick={onClose}
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
    );
}
