"use client";

import React, { useRef, useState } from "react";
import { ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/front/lib/utils";
import { useProjects } from "@/front/queries/projects";
import { DashboardProjectCard } from "./DashboardProjectCard";

/*
  Calcul responsive de la largeur des cards :
  - 1440px page, sidebar ~215px, padding 2×12px → contenu ~1202px
  - On veut 3.5 cards visibles → card ≈ (1202 - 3×16px) / 3.5 ≈ 298px
  - Formule : calc((100vw - 215px - 24px - 3 * 16px) / 3.5)
  - Clamped entre 200px et 298px pour les petits écrans
*/
const CARD_WIDTH = "clamp(200px, calc((100vw - 215px - 24px - 3 * 16px) / 3.5), 298px)";

export function DashboardFeaturedProjects({ className, style }: { className?: string; style?: React.CSSProperties }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: projects = [] } = useProjects();

    const latest = [...projects]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 12);

    const scroll = () => {
        const cardW = scrollRef.current
            ? scrollRef.current.querySelector("div")?.getBoundingClientRect().width ?? 298
            : 298;
        scrollRef.current?.scrollBy({ left: cardW + 16, behavior: "smooth" });
    };

    return (
        <>
            {/* Fullscreen overlay */}
            {isExpanded && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-8">
                    <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E1]">
                            <h2 className="text-[20px] font-bold text-[#000000]">Projet à la Une</h2>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-1.5 hover:bg-[#F7F7F2] rounded-lg cursor-pointer transition-colors"
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

            <div className={cn("bg-white rounded-xl border border-[#E8E8E1] px-6 py-5 flex flex-col", className)} style={style}>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[20px] font-bold text-[#000000]">Projet à la Une</h2>
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="p-1.5 hover:bg-[#F7F7F2] rounded-lg cursor-pointer transition-colors"
                    >
                        <Maximize2 className="w-4 h-4 text-[#8C8A85]" />
                    </button>
                </div>

                {/* Carousel */}
                <div className="relative">
                    {/* Masque le dernier item partiellement pour indiquer le scroll */}
                    <div className="overflow-hidden" style={{ maskImage: "linear-gradient(to right, black 85%, transparent 100%)" }}>
                        <div
                            ref={scrollRef}
                            className="flex gap-4 overflow-x-auto pb-1"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {latest.length === 0 ? (
                                <p className="text-sm text-[#8C8A85] py-6">Aucun projet disponible</p>
                            ) : (
                                latest.map((p) => (
                                    <DashboardProjectCard
                                        key={p.id}
                                        project={p}
                                        className="shrink-0"
                                        style={{ width: CARD_WIDTH, height: "clamp(120px, 15.2vh, 164px)" }}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Flèche droite */}
                    {latest.length > 3 && (
                        <button
                            onClick={scroll}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-9 h-9 bg-white border border-[#E8E8E1] shadow-md rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F7F7F2] transition-colors z-10"
                        >
                            <ChevronRight className="w-5 h-5 text-[#4C4A43]" />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
