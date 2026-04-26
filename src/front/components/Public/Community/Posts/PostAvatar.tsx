import Image from "next/image";
import Link from "next/link";
import { PostWithAuthorAndCategory } from "@/front/types/post.schema";
import { useRouter } from "next/navigation";
import { Item, ItemDescription, ItemTitle } from "@/front/components/ui/item";

export default function PostAvatar({ post }: { post: PostWithAuthorAndCategory }) {
    const router = useRouter()
    const { author, category } = post;
    const displayName = author.firstname && author.lastname
        ? `${author.firstname} ${author.lastname}`
        : author.username ?? "Anonyme";

    const initialName = [
        author.firstname?.[0]?.toUpperCase(),
        author.lastname?.[0]?.toUpperCase()
    ].filter(Boolean).join("") || "?"

    const userHref = author.username ? `/user/${author.username}` : null;

    return (
        <>
            <Item
                className="flex items-center group hover:bg-neutral-50/20 p-2 rounded-md transition-colors cursor-pointer gap-0"
                onClick={(e) => { e.stopPropagation(); router.push(userHref ?? "#"); }}
            >
                {author.image ? (
                    <Image
                        src={author.image}
                        alt={displayName}
                        width={100}
                        height={100}
                        className="w-8 h-8 rounded-full mr-2 group-hover:ring-2 group-hover:ring-neutral-300 transition-all"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full mr-2 bg-neutral-200 flex items-center justify-center text-xs font-medium group-hover:ring-2 group-hover:ring-neutral-300 transition-all">
                        {initialName ? initialName : author.username ?? "Non renseigné"}
                    </div>
                )}
                <div className="flex flex-col">
                    <ItemTitle className="text-sm">{displayName}</ItemTitle>
                    <Link
                        href={`/community/${category.slug}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ItemDescription className="text-[10px] text-neutral-700 hover:underline w-fit">
                            {category.name ? category.name : "Non catégorisé"}
                        </ItemDescription>
                    </Link>
                </div>
            </Item>
        </>
    );
}
