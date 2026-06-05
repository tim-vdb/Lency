"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import { Crown, Users } from "lucide-react";
import Link from "next/link";

type Member = {
    id: string;
    firstname: string | null;
    lastname: string | null;
    username: string | null;
    image: string | null;
    avatarUrl?: string | null;
};

interface ProjectMembersCardProps {
    owner: Member;
    participants: Member[];
}

export function ProjectMembersCard({ owner, participants }: ProjectMembersCardProps) {
    const total = 1 + participants.length;

    return (
        <div className="bg-white rounded-[10px] p-[27px] flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="font-['Poppins',sans-serif] font-semibold text-[24px] leading-[32px] text-black">
                    Membres
                </h2>
                <span className="flex items-center gap-1.5 text-sm text-[#8c8a85]">
                    <Users className="w-4 h-4" />
                    {total}
                </span>
            </div>
            <div className="w-full h-px bg-[#e8e8e1] rounded-full" />

            <div className="flex flex-col gap-3">
                <MemberRow member={owner} role="Créateur" />
                {participants.map((p) => (
                    <MemberRow key={p.id} member={p} role="Membre" />
                ))}
            </div>
        </div>
    );
}

function MemberRow({ member, role }: { member: Member; role: "Créateur" | "Membre" }) {
    const name = getDisplayName(member);
    const initials = getInitialName(member);
    const isCreator = role === "Créateur";

    return (
        <Link
            href={`/user/${member.username ?? member.id}`}
            className="flex items-center gap-3 group"
        >
            <Avatar className="w-9 h-9 shrink-0">
                <AvatarImage src={member.image ?? (member.avatarUrl ?? undefined)} />
                <AvatarFallback className="text-xs bg-neutral-100">
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate group-hover:underline">
                    {name}
                </p>
                {member.username && (
                    <p className="text-xs text-[#8c8a85] truncate">@{member.username}</p>
                )}
            </div>

            {isCreator && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 shrink-0">
                    <Crown className="w-3 h-3" />
                    Créateur
                </span>
            )}
        </Link>
    );
}
