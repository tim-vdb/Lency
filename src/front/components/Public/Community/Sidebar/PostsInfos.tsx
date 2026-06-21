"use client";

import { Card } from "@/front/components/ui/card";
import { PostWithAuthorAndCategory } from "@/front/schemas/types/post.type";
import AuthorInfos from "./AuthorInfos";
import CategoryInfos from "./CategoryInfos";
import { Separator } from "@/front/components/ui/separator";
import { cn } from "@/front/lib/utils";

export default function PostsInfos({ post, className }: { post: PostWithAuthorAndCategory, className?: string }) {
    return (
        <Card className={cn("justify-between py-0 h-fit gap-0 sticky top-0", className)}>
            <AuthorInfos post={post} />
            <Separator className="my-0" />
            <CategoryInfos post={post} />
        </Card>
    );
}