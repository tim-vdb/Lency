"use client";

import { Card } from "@/front/components/ui/card";
import { PostWithAuthorAndCategory } from "@/front/types/post.schema";
import AuthorInfos from "./AuthorInfos";
import CategoryInfos from "./CategoryInfos";
import { Separator } from "@/front/components/ui/separator";

export default function PostsInfos({ post }: { post: PostWithAuthorAndCategory }) {
    return (
        <Card className="justify-between py-0 h-fit gap-0 sticky top-0">
            <AuthorInfos post={post} />
            <Separator className="my-0" />
            <CategoryInfos post={post} />
        </Card>
    );
}