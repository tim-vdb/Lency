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

    findByUsername: async (usernameOrId: string) => {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { username: { equals: usernameOrId, mode: "insensitive" } },
                    { id: usernameOrId },
                ],
            },
            include: {
                Posts: {
                    where: { isPublished: true },
                    include: { author: true, category: true },
                    orderBy: { createdAt: "desc" },
                },
                projects: { where: { status: "PUBLISHED", visibility: { not: "PRIVATE" } }, include: { mapLocation: true }, orderBy: { createdAt: "desc" } },
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
            bio?: string;
            image?: string;
            cv?: string;
            portfolio?: string;
            role?: "ADMIN" | "MEMBER";
            isMarketplaceTalent?: boolean;
            readyToStart?: boolean;
            address?: string;
            latitude?: number;
            longitude?: number;
        }
    ) => {
        return prisma.user.update({ where: { id }, data });
    },

    generateUniqueUsername: async (base: string): Promise<string> => {
        const slug = base
            .normalize("NFD").replace(/[̀-ͯ]/g, "")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-{2,}/g, "-")
            .replace(/^-|-$/g, "");
        let candidate = slug || "user";
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

    search: async (q: string, excludeId: string) => {
        return prisma.user.findMany({
            where: {
                readyToStart: true,
                id: { not: excludeId },
                ...(q && {
                    OR: [
                        { firstname: { contains: q, mode: "insensitive" } },
                        { lastname: { contains: q, mode: "insensitive" } },
                        { username: { contains: q, mode: "insensitive" } },
                    ],
                }),
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                image: true,
                avatarUrl: true,
                bio: true,
                configs: {
                    where: { title: "roles" },
                    select: { content: true },
                    take: 1,
                },
            },
            take: 20,
            orderBy: { createdAt: "desc" },
        });
    },

    saveDeletionToken: async (
        userId: string,
        data: { deletionToken: string; deletionTokenExpiresAt: Date }
    ) => {
        return prisma.user.update({ where: { id: userId }, data });
    },

    findByDeletionToken: async (token: string) => {
        return prisma.user.findFirst({
            where: { deletionToken: token },
        });
    },

    findAllAdmins: async () => {
        return prisma.user.findMany({
            where: { role: "ADMIN" },
            select: { id: true, firstname: true, lastname: true, email: true },
        });
    },

    savePendingPasswordChange: async (
        userId: string,
        data: { pendingPasswordHash: string; passwordChangeToken: string; passwordChangeTokenExpiresAt: Date }
    ) => {
        return prisma.user.update({ where: { id: userId }, data });
    },

    findByPasswordChangeToken: async (hashedToken: string) => {
        return prisma.user.findFirst({
            where: {
                passwordChangeToken: hashedToken,
                passwordChangeTokenExpiresAt: { gt: new Date() },
            },
        });
    },

    applyPasswordChange: async (userId: string, newPasswordHash: string) => {
        await prisma.account.updateMany({
            where: { userId, providerId: 'credential' },
            data: { password: newPasswordHash },
        });
        return prisma.user.update({
            where: { id: userId },
            data: {
                pendingPasswordHash: null,
                passwordChangeToken: null,
                passwordChangeTokenExpiresAt: null,
            },
        });
    },
};