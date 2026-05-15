import PostImage from "@/front/components/Public/Community/Posts/PostImage";
import PostVideo from "@/front/components/Public/Community/Posts/PostVideo";
import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import { PostsService } from "@/back/services/posts.service";
import PostsInfos from "@/front/components/Public/Community/Sidebar/PostsInfos";
import BreadcrumbOverride from "@/front/components/Private/Global/BreadcrumbOverride";

interface PostPageProps {
    params: Promise<{ slug: string; id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
    const { id, slug } = await params;
    const post = await PostsService.findByIdPost(id).catch(() => null);

    if (!post) {
        return <div>Post non trouvé</div>;
    }

    return (
        <div className="flex gap-4 max-w-6xl mx-auto">
            <BreadcrumbOverride segment={slug} label={post.category.name} type="category" />
            <BreadcrumbOverride segment={post.id} label={post.content.slice(0, 40)} />
            {post.format === "IMAGE" && <PostImage post={post} />}
            {post.format === "VIDEO" && <PostVideo post={post} />}
            {post.format === "AUDIO" && <PostAudio post={post} />}
            {post.format === "TEXT" && <PostText post={post} />}
            <PostsInfos post={post} className="hidden xl:flex" />
        </div>
    );
}
