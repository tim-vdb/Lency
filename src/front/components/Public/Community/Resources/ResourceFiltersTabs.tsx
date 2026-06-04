"use client";

import { Badge } from "@/front/components/ui/badge";
import { useCategories } from "@/front/queries/categories";
import { cn } from "@/front/lib/utils";
import Link from "next/link";

interface ResourceFiltersTabsProps {
    activeSlug?: string;
}

export default function ResourceFiltersTabs({ activeSlug }: ResourceFiltersTabsProps) {
    const { data: categories } = useCategories();

    return (
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md rounded-xl mr-1.5 px-2 py-2 overflow-x-auto">
            <div className="flex items-center gap-2 whitespace-nowrap">
                {categories?.map((category) => {
                    const isActive = category.slug === activeSlug;
                    return (
                        <Link
                            key={category.id}
                            href={`/community/${category.slug}/resources`}
                        >
                            <Badge
                                variant={isActive ? "default" : "secondary"}
                                className={cn(
                                    "cursor-pointer transition-colors",
                                    isActive ? "bg-neutral-900" : "hover:bg-neutral-200"
                                )}
                            >
                                {category.name}
                            </Badge>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
