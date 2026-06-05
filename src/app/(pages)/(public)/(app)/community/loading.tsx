import PostSkeleton from "@/front/components/Public/Community/Posts/PostSkeleton";

export default function CommunityLoading() {
    return (
        <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <PostSkeleton key={i} />
            ))}
        </div>
    );
}
