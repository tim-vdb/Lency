import { CardDescription, CardTitle } from "@/front/components/ui/card";
import Image from "next/image";
import { Prisma } from "@/back/generated/prisma_client";

type PostWithAuthor = Prisma.PostGetPayload<{ include: { author: true } }>;

export default function PostAvatar({ post }: { post: PostWithAuthor }) {
    const { author } = post;
    const displayName = author.firstname && author.lastname
        ? `${author.firstname} ${author.lastname}`
        : author.username ?? "Anonyme";

    const initialName = [
        author.firstname?.[0]?.toUpperCase(),
        author.lastname?.[0]?.toUpperCase()
    ].filter(Boolean).join("") || "?"

    return (
        <>
            <div className="flex">
                {author.avatarUrl ? (
                    <Image src={author.avatarUrl} alt={displayName} width={100} height={100} className="w-8 h-8 rounded-full mr-2" />
                ) : (
                    <div className="w-8 h-8 rounded-full mr-2 bg-neutral-200 flex items-center justify-center text-xs font-medium">
                        {initialName}
                    </div>
                )}
                <div>
                    <CardTitle className="text-sm">{displayName}</CardTitle>
                    <CardDescription className="text-[10px] text-neutral-700">@{author.username ?? "inconnu"}</CardDescription>
                </div>
            </div>
        </>
    );
}