import { Prisma } from "@/back/generated/prisma_client";
import { PostWithUserState } from "./post.type";

export type UserProfileBase = Prisma.UserGetPayload<{
    include: {
        projects: { include: { mapLocation: true } };
        participants: { select: { id: true; title: true } };
        configs: { select: { title: true; content: true } };
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
        following: {
            include: {
                following: {
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
                followers: true;
            };
        };
        socialLinks: true;
    };
}>;

export type UserProfile = UserProfileBase & {
    Posts: PostWithUserState[];
    isFollowed: boolean;
    isReported: boolean;
};
