import { Prisma } from "@/back/generated/prisma_client";

export type PostWithAuthorAndCategory = Prisma.PostGetPayload<{ include: { author: true; category: true } }>;

export type CommentBase = Prisma.CommentGetPayload<{ include: { author: true } }>;
export type CommentWithAuthor = CommentBase & { children: CommentBase[] };