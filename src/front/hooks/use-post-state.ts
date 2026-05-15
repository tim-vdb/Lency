import { useState, useEffect, useCallback, useRef } from "react";
import { PostWithUserState } from "@/front/types/post.schema";
import { useRecentlyViewed } from "@/front/stores/use-recently-viewed.store";

export function usePostState(post: PostWithUserState) {
    const [expanded, setExpanded] = useState(false);
    const [openComments, setOpenComments] = useState(false);
    const [isVoted, setIsVoted] = useState(post.isVoted ?? false);
    const [isSaved, setIsSaved] = useState(post.isSaved ?? false);
    const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount);

    const add = useRecentlyViewed((s) => s.add);
    const syncCounts = useRecentlyViewed((s) => s.syncCounts);
    const postRef = useRef(post);
    useEffect(() => { postRef.current = post; }, [post]);
    const markViewed = useCallback(() => add(postRef.current), [add]);

    useEffect(() => {
        setIsVoted(post.isVoted ?? false);
        setIsSaved(post.isSaved ?? false);
        setUpvoteCount(post.upvoteCount);
    }, [post.id, post.isVoted, post.isSaved, post.upvoteCount]);

    useEffect(() => {
        syncCounts(post.id, {
            upvoteCount: post.upvoteCount,
            commentCount: post.commentCount,
            saveCount: post.saveCount,
        });
    }, [post.id, post.upvoteCount, post.commentCount, post.saveCount, syncCounts]);

    return {
        expanded,
        setExpanded,
        openComments,
        setOpenComments,
        isVoted,
        setIsVoted,
        isSaved,
        setIsSaved,
        upvoteCount,
        setUpvoteCount,
        markViewed,
    };
}
