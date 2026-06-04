import { Prisma } from "@/back/generated/prisma_client";

export type ResourceWithAuthorAndCategory = Prisma.ResourceGetPayload<{
    include: { author: true; category: true };
}>;

export type ResourceWithUserState = ResourceWithAuthorAndCategory & {
    isSaved: boolean;
    isVoted: boolean;
};
