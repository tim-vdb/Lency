"use client";

import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import { UserProfile } from "@/front/schemas/types/user.type";
import Link from "next/link";

export default function UserFollowingCommunities({ follows }: { follows: UserProfile["categoryFollows"] }) {
    return (
        <Card className="gap-2">
            <CardHeader>
                <CardTitle className="text-sm">Communautés suivies</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
                {follows.length === 0 && (
                    <p className="text-xs text-neutral-400">Aucune communauté suivie.</p>
                )}
                {follows.map((follow, index) => (
                    <Button key={index} asChild variant="outline" className="w-fit">
                        <Link
                            href={`/community/${follow.category.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs"
                        >
                            {follow.category.name}
                        </Link>
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}
