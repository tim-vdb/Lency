"use client";

import { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/front/lib/utils";
import type { RefObject } from "react";

interface SearchInputProps {
    query: string;
    inputRef: RefObject<HTMLInputElement | null>;
    onChange: (value: string) => void;
    onFocus: () => void;
}

export const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
function SearchInput({ query, inputRef, onChange, onFocus }, ref) {
    return (
        <div ref={ref} className={cn(
            "relative flex items-center gap-2 px-3 h-8 rounded-lg w-full transition-all duration-200",
            "border border-neutral-200 dark:border-neutral-800",
            "bg-white dark:bg-transparent",
            "focus-within:border-neutral-300 dark:focus-within:border-neutral-700"
        )}>
            <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-400 shrink-0" />
            <input
                ref={inputRef}
                value={query}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                placeholder="Rechercher…"
                className="flex-1 min-w-0 bg-transparent text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-zinc-400 outline-none"
            />
            {query ? (
                <button
                    onClick={() => { onChange(""); inputRef.current?.focus(); }}
                    className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400 transition-colors shrink-0"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            ) : (
                <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-neutral-400 dark:text-zinc-400 font-mono shrink-0">
                    <span className="text-xs">⌘</span>K
                </kbd>
            )}
        </div>
    );
});
