import { Card, CardContent } from "@/front/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/front/components/ui/popover";
import { cn } from "@/front/lib/utils";
import { Download, Bookmark, EyeOff, Flag, Ellipsis, Heart, MessageCircleMore, Share } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PostWithAuthorAndCategory } from "@/front/types/post.schema";
interface PostTextProps {
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

export default function PostText({ post, className }: PostTextProps) {
    const { author, category } = post;
    const [expanded, setExpanded] = useState(false);

    const displayName = author.firstname && author.lastname
        ? `${author.firstname} ${author.lastname}`
        : author.username ?? "Anonyme";

    const initials = [
        author.firstname?.[0]?.toUpperCase(),
        author.lastname?.[0]?.toUpperCase(),
    ].filter(Boolean).join("") || "?";

    return (
        <Card className={cn("relative", className)}>
            <CardContent className="flex flex-col gap-3">
                {/* Menu "..." top-right */}
                <div className="absolute top-3 right-3">
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
                <div className="flex items-center gap-2 pr-8">
                    {author.avatarUrl ? (
                        <Image
                            src={author.avatarUrl}
                            alt={displayName}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-full shrink-0"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium shrink-0">
                            {initials}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium leading-tight">{displayName}</span>
                        {category && (
                            <span className="text-xs text-neutral-400 leading-tight">{category.name}</span>
                        )}
                    </div>
                </div>

                {/* Text content */}
                <p className={cn("text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed", !expanded && "line-clamp-3")}>
                    {post.content}{" "}
                    {!expanded && (
                        <button
                            onClick={() => setExpanded(true)}
                            className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                        >
                            ...plus
                        </button>
                    )}
                </p>

                {/* Actions — aligned right */}
                <div className="flex items-center gap-4 justify-end">
                    {actionItems.map(({ icon: Icon, key }) => (
                        <div key={key} className="flex flex-col items-center gap-0.5">
                            <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                            <span className="text-[10px] text-neutral-400">{MOCK_COUNTS[key]}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
