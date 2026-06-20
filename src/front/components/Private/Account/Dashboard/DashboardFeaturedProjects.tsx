"use client";

import React, { useState } from "react";
import { Maximize2, X } from "lucide-react";
import { cn } from "@/front/lib/utils";
import { useProjects } from "@/front/queries/projects";
import { DashboardProjectCard } from "./DashboardProjectCard";

export function DashboardFeaturedProjects({ className, style }: { className?: string; style?: React.CSSProperties }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: projects = [] } = useProjects();

    const latest = [...projects]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

    return (
        <>
            {/* Fullscreen overlay */}
            {isExpanded && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-8">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E1] dark:border-neutral-700">
                            <h2 className="text-[20px] font-bold text-[#000000] dark:text-white">Projet à la Une</h2>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-1.5 hover:bg-[#F7F7F2] dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors"
                            >
                                <X className="w-5 h-5 text-[#8C8A85]" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4 p-6 overflow-y-auto">
                            {latest.map((p) => (
                                <DashboardProjectCard
                                    key={p.id}
                                    project={p}
                                    className="w-[298px] shrink-0"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className={cn("bg-white dark:bg-neutral-900 rounded-xl border border-[#E8E8E1] dark:border-neutral-700 px-6 py-5 flex flex-col", className)} style={style}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[20px] font-bold text-[#000000] dark:text-white">Projet à la Une</h2>
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="p-1.5 hover:bg-[#F7F7F2] dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors"
                    >
                        <Maximize2 className="w-4 h-4 text-[#8C8A85]" />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-4 gap-4 w-full">
                    {latest.length === 0 ? (
                        <p className="text-sm text-[#8C8A85] py-6">Aucun projet disponible</p>
                    ) : (
                        latest.map((p) => (
                            <DashboardProjectCard
                                key={p.id}
                                project={p}
                                compact
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
