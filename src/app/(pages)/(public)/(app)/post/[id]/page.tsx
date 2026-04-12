import PostDesktop from "@/front/components/Public/Community/Posts/PostDesktop";
import { PostsAction } from "@/back/repositories/posts.action";
import { PostWithAuthorAndCategory } from "@/front/types/post.schema";
import PostsInfos from "@/front/components/Public/Community/Sidebar/PostsInfos";
interface PostPageProps {
    params: {
        id: string;
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { id } = await params;
    const post: PostWithAuthorAndCategory | null = await PostsAction.findById(id);

    if (!post) {
        return <div>Post non trouvé</div>;
    }

    return (
        <div className="flex gap-2 mr-1.5">
            <PostDesktop post={post} />
            <PostsInfos post={post} />
        </div>
    );
}