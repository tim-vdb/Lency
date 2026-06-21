"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn, getDisplayName, getInitialName } from "@/front/lib/utils";
import { getTalentRoles, getTalentPreferences } from "@/front/lib/api/talents";
import type { Talent } from "@/front/lib/api/talents";

const WORK_MODE_LABELS: Record<string, string> = {
    PRESENTIEL: "Présentiel",
    DISTANCIEL: "Distanciel",
    HYBRIDE: "Hybride",
};

const LEVEL_LABELS: Record<string, string> = {
    DEBUTANT: "Débutant",
    INTERMEDIAIRE: "Intermédiaire",
    AVANCE: "Avancé",
};

interface DashboardTalentCardProps {
    talent: Talent;
    className?: string;
    style?: React.CSSProperties;
}

export function DashboardTalentCard({ talent, className, style }: DashboardTalentCardProps) {
    const name = getDisplayName(talent);
    const initials = getInitialName(talent);
    const avatar = talent.image ?? talent.avatarUrl;
    const roles = getTalentRoles(talent).slice(0, 2);
    const prefs = getTalentPreferences(talent);

    return (
        <div
            className={cn("bg-white dark:bg-neutral-900 rounded-xl border border-[#E8E8E1] dark:border-neutral-700 p-4 flex flex-col gap-3", className)}
            style={style}
        >
            {/* Avatar + nom + adresse */}
            <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-[#E8E8E1] dark:bg-neutral-700 shrink-0 overflow-hidden flex items-center justify-center text-xs font-semibold text-[#4C4A43] dark:text-neutral-300">
                    {avatar
                        ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
                        : initials}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[16px] font-semibold text-[#000000] dark:text-white leading-snug line-clamp-1">
                        {name}
                    </span>
                    {talent.address && (
                        <span className="flex items-center gap-1 text-[12px] text-[#8C8A85] min-w-0">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{talent.address}</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Bio */}
            <p className="text-[13px] leading-[1.55] text-[#4C4A43] dark:text-neutral-300 line-clamp-2 flex-1">
                {talent.bio ?? "Aucune bio disponible."}
            </p>

            {/* Footer : tags + CTA */}
            <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1 flex-wrap min-w-0 flex-1 overflow-hidden">
                    {roles.map((role) => (
                        <span
                            key={role}
                            className="text-[11px] px-2 py-0.5 bg-[#F7F7F2] dark:bg-neutral-800 border border-[#E8E8E1] dark:border-neutral-700 rounded-lg text-[#4C4A43] dark:text-neutral-300 whitespace-nowrap"
                        >
                            {role}
                        </span>
                    ))}
                    {prefs.workMode && (
                        <span className="text-[11px] px-2 py-0.5 bg-[#F7F7F2] dark:bg-neutral-800 border border-[#E8E8E1] dark:border-neutral-700 rounded-lg text-[#4C4A43] dark:text-neutral-300 whitespace-nowrap">
                            {WORK_MODE_LABELS[prefs.workMode] ?? prefs.workMode}
                        </span>
                    )}
                    {prefs.level && (
                        <span className="text-[11px] px-2 py-0.5 bg-[#F7F7F2] dark:bg-neutral-800 border border-[#E8E8E1] dark:border-neutral-700 rounded-lg text-[#4C4A43] dark:text-neutral-300 whitespace-nowrap">
                            {LEVEL_LABELS[prefs.level] ?? prefs.level}
                        </span>
                    )}
                </div>

                <Link href={`/user/${talent.username ?? talent.id}`} className="shrink-0">
                    <button className="text-[13px] font-medium h-8 px-4 rounded-lg cursor-pointer whitespace-nowrap transition-colors border border-[#E8E8E1] dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#000000] dark:text-white hover:bg-[#EA3D0E] hover:text-white hover:border-[#EA3D0E]">
                        Voir le profil
                    </button>
                </Link>
            </div>
        </div>
    );
}
