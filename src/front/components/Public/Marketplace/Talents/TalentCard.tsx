"use client";

import { Talent } from "@/front/lib/api/talents";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import { ExternalLink, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TalentCard({ talent }: { talent: Talent }) {
    const displayName = getDisplayName(talent);
    const initials = getInitialName(talent);
    const avatarSrc = talent.avatarUrl ?? talent.image ?? null;
    const followerCount = talent._count.followers;
    const profileHref = talent.username ? `/user/${talent.username}` : `/user/${talent.id}`;

    return (
        <div className="bg-white rounded-[10px] p-5 flex flex-col gap-4 h-full transition-shadow duration-200 hover:shadow-md">

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
                    {followerCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-orange rounded-full flex items-center justify-center font-['Poppins',sans-serif] font-medium text-[10px] text-white leading-none">
                            {followerCount > 99 ? "99+" : followerCount}
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

            {/* ── Catégories / spécialités ── */}
            {talent.categoryFollows.length > 0 && (
                <div className="flex flex-col gap-1.5">
                    <span className="font-['Poppins',sans-serif] text-[11px] font-semibold uppercase tracking-wide text-gray">
                        Spécialités
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {talent.categoryFollows.slice(0, 3).map(({ category }) => (
                            <span
                                key={category.id}
                                className="inline-flex items-center h-[22px] px-2.5 bg-neutral-100 rounded-full font-['Poppins',sans-serif] text-[11px] text-[#4c4a43]"
                            >
                                {category.name}
                            </span>
                        ))}
                        {talent.categoryFollows.length > 3 && (
                            <span className="inline-flex items-center h-[22px] px-2 bg-neutral-100 rounded-full font-['Poppins',sans-serif] text-[11px] text-gray">
                                +{talent.categoryFollows.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ── Badges / rôles ── */}
            {talent.badges.length > 0 && (
                <div className="flex flex-col gap-1.5">
                    <span className="font-['Poppins',sans-serif] text-[11px] font-semibold uppercase tracking-wide text-gray">
                        Rôles
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {talent.badges.slice(0, 3).map((badge) => (
                            <span
                                key={badge.id}
                                className="inline-flex items-center h-6 px-2.5 border border-black rounded-[5px] font-['Poppins',sans-serif] text-[11px] text-black"
                            >
                                {badge.name}
                            </span>
                        ))}
                        {talent.badges.length > 3 && (
                            <span className="inline-flex items-center h-6 px-2 border border-neutral-300 rounded-[5px] font-['Poppins',sans-serif] text-[11px] text-[#4c4a43]">
                                +{talent.badges.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ── Bio ── */}
            {talent.bio && (
                <p className="font-['Poppins',sans-serif] text-[12px] leading-[18px] text-[#4c4a43] line-clamp-2 flex-1">
                    {talent.bio}
                </p>
            )}

            {/* ── Liens portfolio / CV ── */}
            {(talent.portfolio || talent.cv) && (
                <div className="flex gap-2 pt-1 border-t border-neutral-100 mt-auto">
                    {talent.portfolio && (
                        <a
                            href={talent.portfolio}
                            target="_blank"
                            rel="noreferrer noopener"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 h-7 px-3 rounded-md border border-black font-['Poppins',sans-serif] text-[11px] text-black hover:bg-black hover:text-white transition-colors"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Portfolio
                        </a>
                    )}
                    {talent.cv && (
                        <a
                            href={talent.cv}
                            target="_blank"
                            rel="noreferrer noopener"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 h-7 px-3 rounded-md border border-neutral-300 font-['Poppins',sans-serif] text-[11px] text-[#4c4a43] hover:border-black hover:text-black transition-colors"
                        >
                            <FileText className="w-3 h-3" />
                            CV
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
