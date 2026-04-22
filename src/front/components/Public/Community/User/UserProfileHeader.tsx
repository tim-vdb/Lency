"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Badge } from "@/front/components/ui/badge";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent } from "@/front/components/ui/card";
import { UserProfile } from "@/front/types/user.schema";
import { Briefcase, Flag, MessageCircleMore, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";

const defer = () => toast.info("Bientôt disponible");

export default function UserProfileHeader({ user }: { user: UserProfile }) {
    const displayName = user.firstname && user.lastname
        ? `${user.firstname} ${user.lastname}`
        : user.username ?? "Utilisateur";
    const initials = [user.firstname?.[0], user.lastname?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase() || (user.username?.slice(0, 2).toUpperCase() ?? "?");

    const level = user._count.Posts + user._count.projects * 5;

    const stats = [
        { label: "Contributions", value: user._count.Posts },
        { label: "Abonnés", value: user._count.categoryFollows },
        { label: "Projets", value: user._count.projects },
    ];

    return (
        <Card className="gap-4 py-4">
            <CardContent className="flex gap-4">
                <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-neutral-200">
                        <AvatarImage src={user.avatarUrl ?? undefined} alt={displayName} />
                        <AvatarFallback className="text-xl bg-pink-100 text-pink-700">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-400 to-orange-500 border-0 shadow">
                        Lv. {level}
                    </Badge>
                </div>

                <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h1 className="text-xl font-bold truncate">{displayName}</h1>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={defer} title="Suivre">
                                <UserRoundPlus className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={defer} title="Message">
                                <MessageCircleMore className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={defer} title="Signaler">
                                <Flag className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {user.bio && (
                        <p className="text-sm italic text-neutral-500">&ldquo;{user.bio}&rdquo;</p>
                    )}

                    <div className="flex items-center gap-2">
                        {user.portfolio && (
                            <a
                                href={user.portfolio}
                                target="_blank"
                                rel="noreferrer noopener"
                                title="Portfolio"
                                className="text-neutral-500 hover:text-neutral-900 transition-colors"
                            >
                                <Briefcase className="w-4 h-4" />
                            </a>
                        )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center bg-neutral-100 rounded-lg px-3 py-1.5 flex-1"
                            >
                                <span className="text-sm font-semibold">{stat.value}</span>
                                <span className="text-xs text-neutral-500">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
