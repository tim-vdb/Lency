import { prisma } from "../lib/prisma";

export const UsersAction = {
    findById: async (id: string) => {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    findAll: async () => {
        return prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
    },

    findByEmail: async (email: string) => {
        return prisma.user.findUnique({
            where: { email },
            select: { firstname: true }
        }).catch(() => null);
    },

    findByUsername: async (username: string) => {
        return prisma.user.findUnique({
            where: { username },
            include: {
                Posts: {
                    where: { isPublished: true },
                    include: { author: true, category: true },
                    orderBy: { createdAt: "desc" },
                },
                projects: { include: { mapLocation: true }, orderBy: { createdAt: "desc" } },
                participants: {
                    where: { visibility: "PUBLIC", status: "PUBLISHED" },
                    select: { id: true, title: true },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
                configs: {
                    where: { title: { in: ["roles", "audiovisual", "preferences"] } },
                    select: { title: true, content: true },
                },
                badges: true,
                categoryFollows: { include: { category: true } },
                followers: {
                    include: {
                        follower: {
                            select: {
                                id: true,
                                username: true,
                                firstname: true,
                                lastname: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
                following: {
                    include: {
                        following: {
                            select: {
                                id: true,
                                username: true,
                                firstname: true,
                                lastname: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 12,
                },
                _count: {
                    select: {
                        Posts: true,
                        projects: true,
                        categoryFollows: true,
                        badges: true,
                        followers: true,
                    },
                },
                socialLinks: { orderBy: { createdAt: "asc" } },
            },
        });
    },

    toggleFollowUser: async (followerId: string, followingId: string) => {
        const existing = await prisma.userFollow.findUnique({
            where: { followerId_followingId: { followerId, followingId } },
        });
        if (existing) {
            await prisma.userFollow.delete({
                where: { followerId_followingId: { followerId, followingId } },
            });
            return { following: false };
        }
        await prisma.userFollow.create({ data: { followerId, followingId } });
        return { following: true };
    },

    isFollowing: async (followerId: string, followingId: string) => {
        const record = await prisma.userFollow.findUnique({
            where: { followerId_followingId: { followerId, followingId } },
        });
        return !!record;
    },

    reportUser: async (reporterId: string, reportedId: string, reason?: string) => {
        return prisma.userReport.upsert({
            where: { reporterId_reportedId: { reporterId, reportedId } },
            create: { reporterId, reportedId, reason },
            update: { reason },
        });
    },

    isReported: async (reporterId: string, reportedId: string) => {
        const record = await prisma.userReport.findUnique({
            where: { reporterId_reportedId: { reporterId, reportedId } },
        });
        return !!record;
    },

    create: async (data: {
        email: string;
        name?: string;
        firstname?: string;
        lastname?: string;
        username?: string;
        password?: string;
        role?: "ADMIN" | "MEMBER";
    }) => {
        return prisma.user.create({ data });
    },

    update: async (
        id: string,
        data: {
            name?: string;
            firstname?: string;
            lastname?: string;
            username?: string;
            phone?: string;
            bio?: string;
            image?: string;
            cv?: string;
            portfolio?: string;
            role?: "ADMIN" | "MEMBER";
            isPremium?: boolean;
            isMarketplaceTalent?: boolean;
            readyToStart?: boolean;
        }
    ) => {
        return prisma.user.update({ where: { id }, data });
    },

    generateUniqueUsername: async (base: string): Promise<string> => {
        const slug = base.toLowerCase().replace(/\s+/g, "");
        let candidate = slug;
        let suffix = 1;
        while (await prisma.user.findUnique({ where: { username: candidate } })) {
            candidate = `${slug}${suffix++}`;
        }
        return candidate;
    },

    delete: async (id: string) => {
        return prisma.user.delete({ where: { id } });
    },

    findByEmailChangeToken: async (hashedToken: string) => {
        return prisma.user.findFirst({
            where: {
                emailChangeToken: hashedToken,
                emailChangeTokenExpiresAt: { gt: new Date() },
            },
        });
    },

    findCredentialAccount: async (userId: string) => {
        return prisma.account.findFirst({
            where: { userId, providerId: 'credential' },
            select: { password: true },
        });
    },

    savePendingEmailChange: async (
        userId: string,
        data: { pendingEmail: string; emailChangeToken: string; emailChangeTokenExpiresAt: Date }
    ) => {
        return prisma.user.update({ where: { id: userId }, data });
    },

    confirmEmailChange: async (userId: string, newEmail: string) => {
        return prisma.user.update({
            where: { id: userId },
            data: {
                email: newEmail,
                emailVerified: true,
                pendingEmail: null,
                emailChangeToken: null,
                emailChangeTokenExpiresAt: null,
            },
        });
    },

    upsertSocialLink: async (userId: string, platform: string, url: string) => {
        return prisma.userSocialLink.upsert({
            where: { userId_platform: { userId, platform } },
            create: { userId, platform, url },
            update: { url },
        });
    },

    deleteSocialLink: async (userId: string, platform: string) => {
        return prisma.userSocialLink.delete({
            where: { userId_platform: { userId, platform } },
        });
    },
};