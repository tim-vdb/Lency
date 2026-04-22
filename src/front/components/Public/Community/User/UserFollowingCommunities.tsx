"use client";

import { Badge } from "@/front/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import { UserProfile } from "@/front/types/user.schema";
import Link from "next/link";

export default function UserFollowingCommunities({ follows }: { follows: UserProfile["categoryFollows"] }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm">Communautés suivies</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
                {follows.length === 0 && (
                    <p className="text-xs text-neutral-400">Aucune communauté suivie.</p>
                )}
                {follows.map((follow) => (
                    <Link key={follow.id} href={`/community/${follow.category.slug}`}>
                        <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-neutral-200">
                            {follow.category.name}
                        </Badge>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}
