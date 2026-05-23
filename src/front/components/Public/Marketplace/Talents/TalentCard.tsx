"use client";

import { Talent } from "@/front/lib/api/talents";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function TalentCard({ talent }: { talent: Talent }) {
    const displayName = getDisplayName(talent);
    const initials = getInitialName(talent);
    const avatarSrc = talent.avatarUrl ?? talent.image ?? null;
    const followerCount = talent._count.followers;

    return (
        <Link
            href={talent.username ? `/profile/${talent.username}` : `/profile/${talent.id}`}
            className="block group"
        >
            <div className="bg-white rounded-[10px] p-5 flex flex-col gap-3 h-full transition-shadow duration-200 hover:shadow-md">
                {/* Header : avatar + nom + badges compétences */}
                <div className="flex items-start gap-4">
                    {/* Avatar avec badge followers */}
                    <div className="relative shrink-0">
                        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-neutral-100">
                            {avatarSrc ? (
                                <Image
                                    src={avatarSrc}
                                    alt={displayName}
                                    width={70}
                                    height={70}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#e8e8e1] font-['Poppins',sans-serif] font-bold text-[20px] text-[#4c4a43]">
                                    {initials}
                                </div>
                            )}
                        </div>
                        {/* Badge followers */}
                        {followerCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#ea3d0e] rounded-full flex items-center justify-center font-['Poppins',sans-serif] font-medium text-[10px] text-white leading-none">
                                {followerCount > 99 ? "99+" : followerCount}
                            </span>
                        )}
                    </div>

                    {/* Nom + badges compétences */}
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] leading-6 text-black truncate">
                            {displayName}
                        </h3>
                        {talent.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {talent.badges.slice(0, 3).map((badge) => (
                                    <span
                                        key={badge.id}
                                        className="inline-flex items-center h-[26px] px-3 border border-black rounded-[5px] font-['Poppins',sans-serif] text-[12px] text-black"
                                    >
                                        {badge.name}
                                    </span>
                                ))}
                                {talent.badges.length > 3 && (
                                    <span className="inline-flex items-center h-[26px] px-2 border border-black rounded-[5px] font-['Poppins',sans-serif] text-[12px] text-[#4c4a43]">
                                        +{talent.badges.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio */}
                {talent.bio && (
                    <p className="font-['Poppins',sans-serif] text-[13px] leading-5 text-[#4c4a43] line-clamp-3">
                        {talent.bio}
                    </p>
                )}
            </div>
        </Link>
    );
}
