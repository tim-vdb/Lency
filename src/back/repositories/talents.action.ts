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
                address: true,
                latitude: true,
                longitude: true,
                portfolio: true,
                cv: true,
                categoryFollows: {
                    select: { category: { select: { id: true, name: true } } },
                    take: 4,
                },
                configs: {
                    where: { title: { in: ["roles", "audiovisual", "preferences"] } },
                    select: { title: true, content: true },
                },
                _count: { select: { followers: true, participants: true, projects: true, Posts: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
};
