import { Card, CardContent } from "@/front/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/front/components/ui/popover";
import { Prisma } from "@/back/generated/prisma_client";
import { cn } from "@/front/lib/utils";
import { Download, Bookmark, EyeOff, Flag, Ellipsis, Heart, MessageCircleMore, Share } from "lucide-react";
import Image from "next/image";

type PostWithAuthorAndCategory = Prisma.PostGetPayload<{ include: { author: true; category: true } }>;

interface PostMobileProps {
    post: PostWithAuthorAndCategory;
    className?: string;
}

const menuItems = [
    { icon: Download, label: "Télécharger" },
    { icon: Bookmark, label: "Enregistrer" },
    { icon: EyeOff, label: "Pas intéressé" },
    { icon: Flag, label: "Signaler", className: "text-red-500" },
]

const actionItems = [
    { icon: Heart, key: "likes" as const },
    { icon: MessageCircleMore, key: "comments" as const },
    { icon: Bookmark, key: "bookmarks" as const },
    { icon: Share, key: "shares" as const },
]

const MOCK_COUNTS = { likes: 1263, comments: 67, bookmarks: 28, shares: 34 }

export default function PostMobile({ post, className }: PostMobileProps) {
    const { author, category } = post;

    const displayName = author.firstname && author.lastname
        ? `${author.firstname} ${author.lastname}`
        : author.username ?? "Anonyme";

    const initials = [
        author.firstname?.[0]?.toUpperCase(),
        author.lastname?.[0]?.toUpperCase(),
    ].filter(Boolean).join("") || "?";

    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardContent className="flex">
                {/* Left: portrait image */}
                <div className="relative w-[45%] shrink-0">
                    <Image
                        src="/images/blog/img1.jpg"
                        alt={post.title}
                        width={300}
                        height={500}
                        className="w-full h-[500px] object-cover rounded-md"
                    />
                </div>

                {/* Right: content */}
                <div className="flex flex-col flex-1 p-3 gap-2 relative">
                    {/* Menu "..." top-right */}
                    <div className="absolute top-2 right-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                    <Ellipsis className="w-5 h-5 text-neutral-500" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-44 p-1" align="end">
                                {menuItems.map(({ icon: Icon, label, className }) => (
                                    <button
                                        key={label}
                                        className={cn(
                                            "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                                            className
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                ))}
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Avatar + username + category */}
                    <div className="flex items-center gap-2 pr-6">
                        {author.avatarUrl ? (
                            <Image
                                src={author.avatarUrl}
                                alt={displayName}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full shrink-0"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-medium shrink-0">
                                {initials}
                            </div>
                        )}
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium leading-tight truncate">{displayName}</span>
                            {category && (
                                <span className="text-xs text-neutral-400 leading-tight truncate">{category.name}</span>
                            )}
                        </div>
                    </div>

                    {/* Dashed separator */}
                    <hr className="border-dashed border-neutral-300 dark:border-neutral-600" />

                    {/* Action icons */}
                    <div className="flex items-center gap-3">
                        {actionItems.map(({ icon: Icon, key }) => (
                            <div key={key} className="flex flex-col items-center gap-0.5">
                                <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                                <span className="text-[10px] text-neutral-400">{MOCK_COUNTS[key]}</span>
                            </div>
                        ))}
                    </div>

                    {/* Dashed separator */}
                    <hr className="border-dashed border-neutral-300 dark:border-neutral-600" />

                    {/* Text content */}
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-4">
                        {post.content}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
