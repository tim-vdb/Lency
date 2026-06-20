import { cn } from "@/front/lib/utils";
import { RotateCcw } from "lucide-react";

export function FiltersPanel({ open, children, hasActiveFilters, onReset }: {
    open: boolean;
    children: React.ReactNode;
    hasActiveFilters?: boolean;
    onReset?: () => void;
}) {
    return (
        <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", {
            "max-h-[500px] opacity-100 mt-1": open,
            "max-h-0 opacity-0": !open,
        })}>
            <div className="bg-white rounded-[10px] p-6 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                    {children}
                </div>
                {hasActiveFilters && onReset && (
                    <div className="flex justify-end border-t border-gray-light pt-4">
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray hover:text-black transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
