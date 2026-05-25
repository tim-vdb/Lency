import { prisma } from "../lib/prisma";

export const TalentsAction = {
    findAll: async () =>
        prisma.user.findMany({
            where: { isMarketplaceTalent: true },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                image: true,
                avatarUrl: true,
                bio: true,
                portfolio: true,
                cv: true,
                badges: { select: { id: true, name: true } },
                categoryFollows: {
                    select: { category: { select: { id: true, name: true } } },
                    take: 4,
                },
                _count: { select: { followers: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
};
