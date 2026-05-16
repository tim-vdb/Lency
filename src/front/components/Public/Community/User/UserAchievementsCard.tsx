"use client";

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/front/components/ui/avatar";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import Link from "next/link";

type Badge = {
    id: string;
    name: string;
    iconUrl?: string | null;
};

interface UserAchievementsCardProps {
    badges: Badge[];
    userId: string;
}

export default function UserAchievementsCard({ badges, userId }: UserAchievementsCardProps) {
    const previewCount = Math.min(badges.length, 3);
    const preview = badges.slice(0, previewCount);
    const remaining = badges.length - previewCount;

    const names = preview.slice(0, 2).map((b) => b.name).join(", ");
    const label = badges.length === 0
        ? "Aucun succès débloqué pour le moment."
        : `${names}${remaining > 0 ? ` et ${remaining} autre${remaining > 1 ? "s" : ""} succès` : ""} débloqué${badges.length > 1 ? "s" : ""}`;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm">Succès</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    {badges.length > 0 && (
                        <AvatarGroup>
                            {preview.map((badge) => (
                                <Avatar key={badge.id} className="h-8 w-8 border border-black/50">
                                    <AvatarImage src={badge.iconUrl ?? undefined} alt={badge.name} />
                                    <AvatarFallback className="text-[10px]">
                                        {badge.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                            {remaining > 0 && (
                                <AvatarGroupCount className="h-8 w-8 border border-black/50" count={remaining} />
                            )}
                        </AvatarGroup>
                    )}
                    <p className="text-xs text-neutral-500 flex-1">{label}</p>
                </div>
                {badges.length > 0 && (
                    <Button asChild variant="outline" className="w-full text-xs">
                        <Link href={`/user/${userId}/badges`}>
                            Voir tous les succès
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
