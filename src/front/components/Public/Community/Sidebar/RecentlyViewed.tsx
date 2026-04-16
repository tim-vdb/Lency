import { Bookmark, Heart, MessageCircleMore, Share } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/front/components/ui/separator";

interface RecentlyViewedPost {
    id: string;
    username: string;
    avatarUrl?: string;
    daysAgo: number;
    excerpt: string;
    thumbnailUrl?: string;
    likes: number;
    comments: number;
    bookmarks: number;
    shares: number;
}

const MOCK_POSTS: RecentlyViewedPost[] = [
    {
        id: "1",
        username: "utilisateur",
        daysAgo: 15,
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        likes: 1263,
        comments: 67,
        bookmarks: 28,
        shares: 34,
    },
    {
        id: "2",
        username: "utilisateur",
        daysAgo: 15,
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        likes: 1263,
        comments: 67,
        bookmarks: 28,
        shares: 34,
    },
    {
        id: "3",
        username: "utilisateur",
        daysAgo: 15,
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        likes: 1263,
        comments: 67,
        bookmarks: 28,
        shares: 34,
    },
];

function formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
    return String(n);
}

function RecentlyViewedItem({ post }: { post: RecentlyViewedPost }) {
    const initials = post.username[0]?.toUpperCase() ?? "?";

    return (
        <div className="flex flex-col gap-2 py-3">
            {/* Header: avatar + username + date */}
            <div className="flex items-center gap-2">
                {post.avatarUrl ? (
                    <Image
                        src={post.avatarUrl}
                        alt={post.username}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full"
                    />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-neutral-300 dark:bg-neutral-600 flex items-center justify-center text-xs font-medium shrink-0">
                        {initials}
                    </div>
                )}
                <span className="text-xs font-medium truncate">{post.username}</span>
                <span className="text-xs text-neutral-400 shrink-0">•{post.daysAgo}j</span>
            </div>

            {/* Body: excerpt + thumbnail */}
            <div className="flex gap-2 items-start">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 flex-1 leading-snug">
                    {post.excerpt}{" "}
                    <button className="text-xs text-blue-500 hover:underline">...plus</button>
                </p>
                <div className="w-16 h-16 rounded-lg bg-neutral-200 dark:bg-neutral-700 shrink-0 overflow-hidden">
                    {post.thumbnailUrl && (
                        <Image
                            src={post.thumbnailUrl}
                            alt="thumbnail"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Footer: action icons */}
            <div className="flex items-center gap-3">
                {[
                    { icon: Heart, count: post.likes },
                    { icon: MessageCircleMore, count: post.comments },
                    { icon: Bookmark, count: post.bookmarks },
                    { icon: Share, count: post.shares },
                ].map(({ icon: Icon, count }, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <Icon className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-[10px] text-neutral-400">{formatCount(count)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function RecentlyViewed() {
    return (
        <div className="flex flex-col">
            {MOCK_POSTS.map((post, i) => (
                <div key={post.id}>
                    <RecentlyViewedItem post={post} />
                    {i < MOCK_POSTS.length - 1 && <Separator />}
                </div>
            ))}
        </div>
    );
}
