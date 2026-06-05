import { TrendingUp } from "lucide-react";
import type React from "react";

interface SearchSectionProps {
    icon: React.ReactNode;
    label: string;
    trending?: boolean;
    children: React.ReactNode;
}

export function SearchSection({ icon, label, trending, children }: SearchSectionProps) {
    return (
        <div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5">
                <span className="text-neutral-400 dark:text-neutral-600">{icon}</span>
                <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{label}</span>
                {trending && <TrendingUp className="w-2.5 h-2.5 text-neutral-300 dark:text-neutral-700" />}
            </div>
            {children}
        </div>
    );
}
