import { Prisma } from "@/back/generated/prisma_client";

export type PostWithAuthorAndCategory = Prisma.PostGetPayload<{ include: { author: true; category: true } }>;

export type PostWithUserState = PostWithAuthorAndCategory & {
    isSaved: boolean;
    isVoted: boolean;
};

export type CommentBase = Prisma.CommentGetPayload<{ include: { author: true } }>;
export type CommentWithChildren = CommentBase & { children: CommentWithChildren[] };

/** @deprecated use CommentWithChildren */
export type CommentWithAuthor = CommentWithChildren;