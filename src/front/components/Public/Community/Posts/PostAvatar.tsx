import Image from "next/image";
import type { PostWithAuthorAndCategory } from "@/front/types/post.schema";
import { useRouter } from "next/navigation";
import { Item } from "@/front/components/ui/item";
import { cn, getDisplayName, getInitialName } from "@/front/lib/utils";

type AuthorFields = Pick<PostWithAuthorAndCategory["author"], "image" | "firstname" | "lastname" | "username">;

export default function PostAvatar({ author, className }: { author: AuthorFields, className?: string }) {
    const router = useRouter()
    const displayName = getDisplayName(author);
    const initialName = getInitialName(author);
    const userHref = author.username ? `/user/${author.username}` : null;

    return (
        <Item
            className={cn("flex flex-nowrap items-center group hover:bg-neutral-300/20 p-1 pl-0 rounded-md transition-colors cursor-pointer gap-2 min-w-0", className)}
            onClick={(e) => { e.stopPropagation(); router.push(userHref ?? "#"); }}
        >
            <div className="shrink-0">
                {author.image ? (
                    <Image
                        src={author.image}
                        alt={displayName}
                        width={100}
                        height={100}
                        className="w-8 h-8 min-w-8 min-h-8 rounded-full transition-all"
                    />
                ) : (
                    <div className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium transition-all">
                        {initialName}
                    </div>
                )}
            </div>
            <span className="text-base font-medium truncate min-w-0 overflow-hidden">{displayName}</span>
        </Item>
    );
}
