"use client";

import { Button } from "@/front/components/ui/button";
import PostAvatar from "../Posts/PostAvatar";
import { PostWithAuthorAndCategory } from "@/front/types/post.schema";
import { Flag, MessageCircleMore, UserRoundPlus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/front/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "@/front/components/ui/avatar"
import Link from "next/link";

const buttons = [
    { icon: UserRoundPlus, label: "Suivre" },
    { icon: MessageCircleMore, label: "Message" },
    { icon: Flag, label: "Signaler" },
]

const stats = [
    { label: "Contributions", value: 120 },
    { label: "Abonnés", value: 120 },
    { label: "Projets", value: 120 },
]

export default function AuthorInfos({ post }: { post: PostWithAuthorAndCategory }) {
    return (
        <Card className="shadow-none gap-2 py-4">
            <CardHeader className="px-4">
                <PostAvatar author={post.author} />
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4">
                <div className="flex items-center justify-end gap-1 w-full">
                    {buttons.map((button, index) => (
                        <Button key={index} variant={"outline"} title={button.label} className="border border-neutral-400 h-6 w-6 p-0 cursor-pointer">
                            <button.icon className="h-6 w-6" />
                        </Button>
                    ))}
                </div>
                <p className="text-sm text-muted-foreground">
                    {post.author.bio}
                </p>
                <div className="flex items-center w-full justify-center gap-4 rounded-md">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center bg-neutral-100 rounded-lg p-2">
                            <span>{stat.value}</span>
                            <p className="text-xs">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
                <h2 className="text-base font-semibold">Succès</h2>
                <div className="flex flex-col gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <AvatarGroup>
                            <Avatar className="h-8 w-8 border border-black/50">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar className="h-8 w-8 border border-black/50">
                                <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                                <AvatarFallback>LR</AvatarFallback>
                            </Avatar>
                            <AvatarGroupCount className="h-8 w-8 border border-black/50" count={3} />
                        </AvatarGroup>
                        <p className="text-xs text-neutral-500 w-40">Travailleur, Artiste et 3 autres succès débloqué</p>
                    </div>
                    <Button asChild variant="outline" className="w-full py-0 text-sm cursor-pointer">
                        <Link href={`/user/${post.author.id}/badges`}>
                            Voir tous les succès
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card >
    );
}