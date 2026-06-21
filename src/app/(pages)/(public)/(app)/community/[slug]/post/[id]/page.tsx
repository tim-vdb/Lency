import type { Metadata } from 'next';
import PostImage from "@/front/components/Public/Community/Posts/PostImage";
import PostVideo from "@/front/components/Public/Community/Posts/PostVideo";
import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import { PostsService } from "@/back/services/posts.service";
import RecentlyViewedSidebar from "@/front/components/Public/Community/Sidebar/RecentlyViewed/RecentlyViewedSidebar";
import BreadcrumbOverride from "@/front/components/Private/Global/BreadcrumbOverride";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface PostPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { id } = await params;
    const post = await PostsService.findByIdPost(id).catch(() => null);
    if (!post) return { title: 'Post introuvable — Lency' };
    const title = post.content.slice(0, 60) + (post.content.length > 60 ? '…' : '');
    return {
        title: `${title} — Lency`,
        description: post.content.slice(0, 160),
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { id } = await params;
    let post = null;
    try {
        post = await PostsService.findByIdPost(id);
    } catch (error) {
        console.error('[PostPage] Error fetching post:', error);
        notFound();
    }

    if (!post) notFound();

    return (
        <div className="flex flex-col gap-4 max-w-5xl mx-auto">
            <BreadcrumbOverride segment={post.id} label={post.content.slice(0, 40)} />

            <div className="flex flex-col gap-1">
                <Link
                    href={`/community/${post.category.slug}`}
                    className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 w-fit transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {post.category.name}
                </Link>
                <h1 className="text-xl font-semibold line-clamp-2">{post.content.slice(0, 80)}{post.content.length > 80 ? "…" : ""}</h1>
            </div>

            <div className="lg:flex lg:gap-4 items-start w-full">
                <div className="flex-1 min-w-0">
                    {post.format === "IMAGE" && <PostImage post={post} defaultOpenComments lockOpenComments />}
                    {post.format === "VIDEO" && <PostVideo post={post} defaultOpenComments lockOpenComments />}
                    {post.format === "AUDIO" && <PostAudio post={post} defaultOpenComments lockOpenComments />}
                    {post.format === "TEXT" && <PostText post={post} defaultOpenComments lockOpenComments />}
                </div>
                <RecentlyViewedSidebar />
            </div>
        </div>
    );
}
