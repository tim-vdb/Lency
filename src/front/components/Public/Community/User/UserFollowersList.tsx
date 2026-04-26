"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Follower {
    id: string;
    username: string | null;
    firstname: string | null;
    lastname: string | null;
    image: string | null;
}

interface UserFollow {
    follower: Follower;
}

interface UserFollowersListProps {
    followers: UserFollow[];
}

const MAX_VISIBLE = 5;

export default function UserFollowersList({ followers }: UserFollowersListProps) {
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? followers : followers.slice(0, MAX_VISIBLE);

    return (
        <Card className="shadow-none">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Abonnés
                    <span className="text-xs font-normal text-neutral-500">({followers.length})</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {followers.length === 0 && (
                    <p className="text-xs text-neutral-400">Aucun abonné pour le moment.</p>
                )}
                {visible.map(({ follower }) => {
                    const displayName = follower.firstname && follower.lastname
                        ? `${follower.firstname} ${follower.lastname}`
                        : follower.username ?? "Utilisateur";
                    const initials = [follower.firstname?.[0], follower.lastname?.[0]]
                        .filter(Boolean)
                        .join("")
                        .toUpperCase() || (follower.username?.slice(0, 2).toUpperCase() ?? "?");

                    return (
                        <Link
                            key={follower.id}
                            href={`/user/${follower.username}`}
                            className="flex items-center gap-2 group hover:bg-neutral-50 rounded-md p-1 transition-colors"
                        >
                            <Avatar className="w-7 h-7">
                                <AvatarImage src={follower.image ?? undefined} alt={displayName} />
                                <AvatarFallback className="text-[10px] bg-neutral-200">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium group-hover:underline truncate">
                                {displayName}
                            </span>
                        </Link>
                    );
                })}
                {followers.length > MAX_VISIBLE && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 mt-1"
                        onClick={() => setShowAll((v) => !v)}
                    >
                        {showAll ? "Voir moins" : `Voir les ${followers.length - MAX_VISIBLE} autres`}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
