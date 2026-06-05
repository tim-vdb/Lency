import type { FilterKey } from "./SearchBar.constants";

interface SearchFooterProps {
    isLoading: boolean;
    hasResults: boolean;
    sType: string;
    counts: Record<Exclude<FilterKey, "">, number>;
    total: number;
}

export function SearchFooter({ isLoading, hasResults, sType, counts, total }: SearchFooterProps) {
    const activeCount = sType ? counts[sType as Exclude<FilterKey, "">] : total;

    return (
        <div className="flex items-center justify-between px-3.5 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-900/40">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                {isLoading
                    ? "Recherche…"
                    : hasResults
                        ? `${activeCount} résultat${activeCount > 1 ? "s" : ""}`
                        : "Commencez à taper"}
            </span>
        </div>
    );
}
