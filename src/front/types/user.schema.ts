import { Prisma } from "@/back/generated/prisma_client";
import { PostWithUserState } from "./post.schema";

export type UserProfileBase = Prisma.UserGetPayload<{
    include: {
        projects: true;
        badges: true;
        categoryFollows: { include: { category: true } };
        followers: {
            include: {
                follower: {
                    select: {
                        id: true;
                        username: true;
                        firstname: true;
                        lastname: true;
                        image: true;
                    };
                };
            };
        };
        _count: {
            select: {
                Posts: true;
                projects: true;
                categoryFollows: true;
                badges: true;
                followers: true;
            };
        };
    };
}>;

export type UserProfile = UserProfileBase & {
    Posts: PostWithUserState[];
    isFollowed: boolean;
    isReported: boolean;
};
