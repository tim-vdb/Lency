import PostDesktop from "@/front/components/Public/Community/Posts/PostDesktop";
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
        <div className="flex gap-2">
            <BreadcrumbOverride segment={slug} label={post.category.name} type="category" />
            <BreadcrumbOverride segment={post.id} label={post.title} />
            <PostDesktop post={post} />
            <PostsInfos post={post} />
        </div>
    );
}
