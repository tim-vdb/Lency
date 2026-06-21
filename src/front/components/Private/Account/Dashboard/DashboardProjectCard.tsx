"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import { cn } from "@/front/lib/utils";
import type { ProjectWithOwner } from "@/front/schemas/types/project.type";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

interface DashboardProjectCardProps {
    project: ProjectWithOwner;
    className?: string;
    style?: React.CSSProperties;
    compact?: boolean;
}

export function DashboardProjectCard({ project, className, style, compact = false }: DashboardProjectCardProps) {
    const dateLabel = project.startDate ? dayjs(project.startDate).format("D MMM") : null;
    const cityName = project.mapLocation?.name ?? null;
    const displayOwnerName = getDisplayName(project.owner);
    const ownerInitials = getInitialName(project.owner);
    const participants = project.participants ?? [];

    if (compact) {
        return (
            <div className={cn(
                "bg-white dark:bg-neutral-900 rounded-xl border border-[#E8E8E1] dark:border-neutral-700 p-3 flex items-center gap-3",
                className
            )} style={style}>
                <div className="w-10 h-10 rounded-full bg-[#E8E8E1] dark:bg-neutral-700 shrink-0 overflow-hidden flex items-center justify-center text-xs font-semibold text-[#4C4A43] dark:text-neutral-300">
                    {project.owner.image ? (
                        <img src={project.owner.image} alt={displayOwnerName} className="w-full h-full object-cover" />
                    ) : (
                        ownerInitials
                    )}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-[14px] font-semibold text-[#000000] dark:text-white leading-snug line-clamp-1">
                        {project.title}
                    </span>
                    {(dateLabel || cityName) && (
                        <div className="flex items-center gap-3 flex-wrap">
                            {dateLabel && (
                                <span className="flex items-center gap-1 text-[11px] text-[#8C8A85]">
                                    <Calendar className="w-3 h-3 shrink-0" />
                                    {dateLabel}
                                </span>
                            )}
                            {cityName && (
                                <span className="flex items-center gap-1 text-[11px] text-[#8C8A85] min-w-0">
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{cityName}</span>
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <Link href={`/marketplace/${project.id}`} className="shrink-0">
                    <button className="text-[12px] font-medium h-7 px-3 rounded-lg cursor-pointer whitespace-nowrap transition-colors border border-[#E8E8E1] dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#000000] dark:text-white hover:bg-[#EA3D0E] hover:text-white hover:border-[#EA3D0E]">
                        Rejoindre
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className={cn(
            "bg-white dark:bg-neutral-900 rounded-xl border border-[#E8E8E1] dark:border-neutral-700 p-4 flex flex-col gap-3",
            className
        )} style={style}>
            {/* Ligne 1 : avatar + titre + date/lieu */}
            <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-[#E8E8E1] dark:bg-neutral-700 shrink-0 overflow-hidden flex items-center justify-center text-xs font-semibold text-[#4C4A43] dark:text-neutral-300">
                    {project.owner.image ? (
                        <img src={project.owner.image} alt={displayOwnerName} className="w-full h-full object-cover" />
                    ) : (
                        ownerInitials
                    )}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[16px] font-semibold text-[#000000] dark:text-white leading-snug line-clamp-2">
                        {project.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0">
                        {dateLabel && (
                            <span className="flex items-center gap-1 text-[12px] text-[#8C8A85]">
                                <Calendar className="w-3 h-3 shrink-0" />
                                {dateLabel}
                            </span>
                        )}
                        {cityName && (
                            <span className="flex items-center gap-1 text-[12px] text-[#8C8A85] min-w-0">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{cityName}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-[13px] leading-[1.55] text-[#4C4A43] dark:text-neutral-300 line-clamp-4 flex-1">
                {project.description}
            </p>

            {/* Footer : participants + CTA */}
            <div className="flex items-center justify-between gap-2 pt-1">
                {/* Avatars participants */}
                <div className="flex items-center shrink-0">
                    {participants.length > 0 && (
                        <div className="flex -space-x-2">
                            {participants.slice(0, 3).map((p) => (
                                <div
                                    key={p.id}
                                    className="w-7 h-7 rounded-full bg-[#E8E8E1] dark:bg-neutral-700 border-2 border-white dark:border-neutral-900 overflow-hidden flex items-center justify-center text-[10px] font-semibold text-[#4C4A43] dark:text-neutral-300 shrink-0"
                                >
                                    {p.image ? (
                                        <img src={p.image} alt={getDisplayName(p)} className="w-full h-full object-cover" />
                                    ) : (
                                        getInitialName(p)
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {participants.length > 3 && (
                        <span className="text-[12px] text-[#8C8A85] ml-1.5">+{participants.length - 3}</span>
                    )}
                </div>

                {/* Bouton — gris par défaut, orange au survol */}
                <Link href={`/marketplace/${project.id}`}>
                    <button
                        className="text-[13px] font-medium h-8 px-4 rounded-lg cursor-pointer whitespace-nowrap transition-colors border border-[#E8E8E1] dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#000000] dark:text-white hover:bg-[#EA3D0E] hover:text-white hover:border-[#EA3D0E]"
                    >
                        Rejoindre le projet
                    </button>
                </Link>
            </div>
        </div>
    );
}
