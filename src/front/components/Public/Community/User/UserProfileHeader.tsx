"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Badge } from "@/front/components/ui/badge";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent } from "@/front/components/ui/card";
import { useUser } from "@/front/context/UserContext";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useReportUser, useToggleFollowUser } from "@/front/hooks/queries/use-users";
import { UserProfile } from "@/front/types/user.schema";
import { Briefcase, Flag, MessageCircleMore, UserRoundCheck, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UserStats from "./UserStats";
import { cn } from "@/front/lib/utils";

export default function UserProfileHeader({ user }: { user: UserProfile }) {
    const currentUser = useUser();
    const requireAuth = useRequireAuth();
    const isOwnProfile = !!currentUser && currentUser.id === user.id;

    const [isFollowed, setIsFollowed] = useState(user.isFollowed);
    const [isReported, setIsReported] = useState(user.isReported);

    const { mutate: toggleFollow, isPending: followPending } = useToggleFollowUser(user.id, user.username ?? "");
    const { mutate: report, isPending: reportPending } = useReportUser(user.id);

    const displayName = user.firstname && user.lastname
        ? `${user.firstname} ${user.lastname}`
        : user.username ?? "Utilisateur";
    const initials = [user.firstname?.[0], user.lastname?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase() || (user.username?.slice(0, 2).toUpperCase() ?? "?");

    const level = user._count.Posts + user._count.projects * 5;


    function handleFollow() {
        requireAuth(() => {
            const next = !isFollowed;
            toggleFollow(undefined, {
                onSuccess: () => {
                    setIsFollowed(next);
                    toast.success(next ? "Utilisateur suivi." : "Utilisateur désuivi.");
                },
                onError: (error) => {
                    setIsFollowed(isFollowed);
                    toast.error(error.message || "Une erreur est survenue.");
                },
            });
        });
    }

    function handleReport() {
        requireAuth(() => {
            const next = !isReported;
            report(undefined, {
                onSuccess: () => {
                    setIsReported(next);
                    toast.success(next ? "Utilisateur signalé." : "Signalement retiré.");
                },
                onError: (error) => {
                    setIsReported(isReported);
                    toast.error(error.message || "Une erreur est survenue.");
                },
            });
        });
    }

    return (
        <Card className="gap-4 py-4">
            <CardContent className="flex gap-4">
                <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-neutral-200">
                        <AvatarImage src={user.image ?? undefined} alt={displayName} />
                        <AvatarFallback className="text-xl bg-pink-100 text-pink-700">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -top-1 -right-1 bg-linear-to-br from-amber-400 to-orange-500 border-0 shadow">
                        Lv. {level}
                    </Badge>
                </div>

                <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h1 className="text-xl font-bold truncate">{displayName}</h1>
                        {!isOwnProfile && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant={isFollowed ? "default" : "outline"}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={handleFollow}
                                    disabled={followPending}
                                    title={isFollowed ? "Ne plus suivre" : "Suivre"}
                                >
                                    {isFollowed
                                        ? <UserRoundCheck className="h-4 w-4" />
                                        : <UserRoundPlus className="h-4 w-4" />
                                    }
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => toast.info("Bientôt disponible")}
                                    title="Message"
                                >
                                    <MessageCircleMore className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={cn("h-8 w-8 text-red-500 hover:text-red-600")}
                                    onClick={handleReport}
                                    disabled={reportPending}
                                    title="Signaler"
                                >
                                    <Flag className={cn("h-4 w-4", isReported && "fill-red-600")} />
                                </Button>
                            </div>
                        )}
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
                </div>
            </CardContent>
            <UserStats user={user} />
        </Card>
    );
}
