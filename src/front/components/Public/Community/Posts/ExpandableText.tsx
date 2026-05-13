"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/front/lib/utils";

interface ExpandableTextProps {
    content: string;
    lineClamp?: number;
    className?: string;
}

export default function ExpandableText({ content, lineClamp = 3, className }: ExpandableTextProps) {
    const [expanded, setExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (el) setIsClamped(el.scrollHeight > el.clientHeight);
    }, [content]);

    const clampStyle = !expanded
        ? { display: "-webkit-box", WebkitLineClamp: lineClamp, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }
        : undefined;

    return (
        <div>
            <p
                ref={ref}
                style={clampStyle}
                className={cn("text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed", className)}
            >
                {content}
            </p>
            {isClamped && !expanded && (
                <button
                    onClick={() => setExpanded(true)}
                    className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors mt-0.5 cursor-pointer"
                >
                    Voir plus
                </button>
            )}
        </div>
    );
}
