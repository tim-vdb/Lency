"use client";

import { cn } from "@/front/lib/utils";
import { FILTERS, type FilterKey } from "./SearchBar.constants";
import type { SearchResults } from "@/front/lib/api/search";

interface SearchFiltersProps {
    data: SearchResults | undefined;
    isLoading: boolean;
    sType: string;
    setSType: (key: string | null) => void;
    counts: Record<Exclude<FilterKey, "">, number>;
    total: number;
}

export function SearchFilters({ data, isLoading, sType, setSType, counts, total }: SearchFiltersProps) {
    return (
        <div className="flex items-center gap-1 px-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800 overflow-x-auto scrollbar-hide">
            {FILTERS.map(({ key, label, icon: Icon }) => {
                const count = key === "" ? total : counts[key as Exclude<FilterKey, "">];
                const active = sType === key;
                const unavailable = !isLoading && data && key !== "" && count === 0;
                if (unavailable) return null;

                return (
                    <button
                        key={key || "all"}
                        onClick={() => setSType(key || null)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all duration-150",
                            active
                                ? "bg-orange/10 text-orange border border-orange/20"
                                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 border border-transparent"
                        )}
                    >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {label}
                        {!isLoading && count > 0 && (
                            <span className={cn(
                                "text-[10px] tabular-nums font-normal",
                                active ? "text-orange/70" : "text-neutral-400 dark:text-neutral-600"
                            )}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
