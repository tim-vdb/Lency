import PostDesktop from "@/front/components/Public/Community/Posts/PostDesktop";
import { PostsService } from "@/back/services/posts.service";
import PostsInfos from "@/front/components/Public/Community/Sidebar/PostsInfos";

interface PostPageProps {
    params: {
        id: string;
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { id } = await params;
    const post = await PostsService.findByIdPost(id).catch(() => null);

    if (!post) {
        return <div>Post non trouvé</div>;
    }

    return (
        <div className="flex gap-2">
            <PostDesktop post={post} />
            <PostsInfos post={post} />
        </div>
    );
}