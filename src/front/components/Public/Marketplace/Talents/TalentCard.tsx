"use client";

import { Talent, getTalentEquipment, getTalentPreferences, getTalentRoles } from "@/front/lib/api/talents";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import { Briefcase, ExternalLink, FileText, TrendingUp, Wallet, Wrench, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TalentCard({ talent }: { talent: Talent }) {
    const displayName = getDisplayName(talent);
    const initials = getInitialName(talent);
    const avatarSrc = talent.avatarUrl ?? talent.image ?? null;
    const level = talent._count.Posts + talent._count.projects * 5;
    const profileHref = talent.username ? `/user/${talent.username}` : `/user/${talent.id}`;

    const roles = getTalentRoles(talent);
    const equipment = getTalentEquipment(talent);
    const prefs = getTalentPreferences(talent);

    const WORKMODE_LABEL: Record<string, string> = { PRESENTIEL: "Présentiel", DISTANCIEL: "Distanciel", HYBRIDE: "Hybride" };
    const LEVEL_LABEL: Record<string, string> = { DEBUTANT: "Débutant", INTERMEDIAIRE: "Intermédiaire", AVANCE: "Avancé" };
    const REMU_LABEL: Record<string, string> = { REMUNERE: "Rémunéré", NON_REMUNERE: "Non rémunéré" };

    const workModeLabel = prefs.workMode ? WORKMODE_LABEL[prefs.workMode] : null;
    const levelLabel = prefs.level ? LEVEL_LABEL[prefs.level] : null;
    const remuLabel = prefs.remunerationType ? REMU_LABEL[prefs.remunerationType] : null;

    return (
        <div className="bg-white rounded-[10px] p-5 flex flex-col gap-3.5 h-full transition-shadow duration-200 hover:shadow-md">

            {/* ── Header : avatar + nom + followers ── */}
            <Link href={profileHref} className="flex items-start gap-3 group">
                <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-100">
                        {avatarSrc ? (
                            <Image
                                src={avatarSrc}
                                alt={displayName}
                                width={56}
                                height={56}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-light font-['Poppins',sans-serif] font-bold text-[18px] text-[#4c4a43]">
                                {initials}
                            </div>
                        )}
                    </div>
                    {level > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-orange rounded-full flex items-center justify-center font-['Poppins',sans-serif] font-medium text-[10px] text-white leading-none">
                            {level > 99 ? "99+" : level}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-0.5 min-w-0 flex-1 pt-0.5">
                    <h3 className="font-['Poppins',sans-serif] font-bold text-[16px] leading-5 text-black truncate group-hover:text-orange transition-colors">
                        {displayName}
                    </h3>
                    {talent.username && (
                        <span className="font-['Poppins',sans-serif] text-[12px] text-gray truncate">
                            @{talent.username}
                        </span>
                    )}
                </div>
            </Link>

            {/* ── Compétences / rôles déclarés (UserConfig) ── */}
            {roles.length > 0 && (
                <div className="flex flex-col gap-1.5">
                    <span className="font-['Poppins',sans-serif] text-[11px] font-semibold uppercase tracking-wide text-gray">
                        Compétences
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {roles.slice(0, 4).map((role) => (
                            <span
                                key={role}
                                className="inline-flex items-center h-6 px-2.5 bg-orange/10 border border-orange/30 rounded-[5px] font-['Poppins',sans-serif] text-[11px] text-orange font-medium"
                            >
                                {role}
                            </span>
                        ))}
                        {roles.length > 4 && (
                            <span className="inline-flex items-center h-6 px-2 border border-neutral-200 rounded-[5px] font-['Poppins',sans-serif] text-[11px] text-gray">
                                +{roles.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ── Projets (créés + rejoints) ── */}
            {(talent._count.projects + talent._count.participants) > 0 && (
                <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3 text-gray shrink-0" />
                    <span className="font-['Poppins',sans-serif] text-[11px] text-[#4c4a43]">
                        {talent._count.projects + talent._count.participants} projet{(talent._count.projects + talent._count.participants) > 1 ? "s" : ""} rejoint{(talent._count.projects + talent._count.participants) > 1 ? "s" : ""}
                    </span>
                </div>
            )}

            {/* ── Bio ── */}
            {talent.bio && (
                <p className="font-['Poppins',sans-serif] text-[12px] leading-[18px] text-[#4c4a43] line-clamp-2 flex-1">
                    {talent.bio}
                </p>
            )}

            {/* ── Équipement (condensé) ── */}
            {equipment.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Wrench className="w-3 h-3 text-gray shrink-0" />
                    <span className="font-['Poppins',sans-serif] text-[11px] text-gray line-clamp-1">
                        {equipment.join(" · ")}
                    </span>
                </div>
            )}

            {/* ── Disponibilité (workMode / level / remu) ── */}
            {(workModeLabel || levelLabel || remuLabel) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {workModeLabel && (
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-gray shrink-0" />
                            <span className="font-['Poppins',sans-serif] text-[11px] text-[#4c4a43]">{workModeLabel}</span>
                        </div>
                    )}
                    {levelLabel && (
                        <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3 text-gray shrink-0" />
                            <span className="font-['Poppins',sans-serif] text-[11px] text-[#4c4a43]">{levelLabel}</span>
                        </div>
                    )}
                    {remuLabel && (
                        <div className="flex items-center gap-1.5">
                            <Wallet className="w-3 h-3 text-gray shrink-0" />
                            <span className="font-['Poppins',sans-serif] text-[11px] text-[#4c4a43]">{remuLabel}</span>
                        </div>
                    )}
                </div>
            )}

            {(talent.portfolio || talent.cv) && (
                <div className="flex gap-2 pt-1 border-t border-neutral-100 mt-auto">
                    {talent.portfolio && (
                        <Link
                            href={talent.portfolio}
                            target="_blank"
                            rel="noreferrer noopener"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 h-7 px-3 rounded-md border border-black font-['Poppins',sans-serif] text-[11px] text-black hover:bg-black hover:text-white transition-colors"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Portfolio
                        </Link>
                    )}
                    {talent.cv && (
                        <Link
                            href={talent.cv}
                            target="_blank"
                            rel="noreferrer noopener"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 h-7 px-3 rounded-md border font-['Poppins',sans-serif] text-[11px] border-black text-[#4c4a43] hover:bg-black hover:text-white transition-colors"
                        >
                            <FileText className="w-3 h-3" />
                            CV
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
