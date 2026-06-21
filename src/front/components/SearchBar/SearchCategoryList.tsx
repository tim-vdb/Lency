import Link from "next/link";
import type { SearchResults } from "@/front/lib/api/search";

type Category = SearchResults["categories"][number];

export function SearchCategoryList({ categories, onClose }: { categories: Category[]; onClose: () => void }) {
    const sorted = [...categories].sort((a, b) => {
        if (b.subscriberCount !== a.subscriberCount) return b.subscriberCount - a.subscriberCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="grid grid-cols-2 gap-1 p-1">
            {sorted.map((cat) => (
                <Link
                    key={cat.id}
                    href={`/community/${cat.slug}`}
                    onClick={onClose}
                    className="group flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-100"
                >
                    <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    </div>
                    <span className="text-xs text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors font-medium truncate">
                        {cat.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600 ml-auto shrink-0">
                        {cat.subscriberCount > 1 ? `${cat.subscriberCount} abonnés` : `${cat.subscriberCount} abonné`}
                    </span>
                </Link>
            ))}
        </div>
    );
}
