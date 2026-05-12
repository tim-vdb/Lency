import { useState, useEffect } from "react";
import { PostWithUserState } from "@/front/types/post.schema";

export function usePostState(post: PostWithUserState) {
    const [expanded, setExpanded] = useState(false);
    const [openComments, setOpenComments] = useState(false);
    const [isVoted, setIsVoted] = useState(post.isVoted ?? false);
    const [isSaved, setIsSaved] = useState(post.isSaved ?? false);
    const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount);

    useEffect(() => {
        setIsVoted(post.isVoted ?? false);
        setIsSaved(post.isSaved ?? false);
        setUpvoteCount(post.upvoteCount);
    }, [post.id, post.isVoted, post.isSaved, post.upvoteCount]);

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
    };
}
