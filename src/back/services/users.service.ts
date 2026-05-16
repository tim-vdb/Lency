import { UsersAction } from "../repositories/users.action";
import { PostsAction } from "../repositories/posts.action";
import { getUser } from "../lib/auth-session";
import crypto from "crypto";

export const UsersService = {
    findByIdUser: async (id: string) => {
        const user = await UsersAction.findById(id);
        if (!user) throw new Error("User not found");
        return user;
    },

    findByUsername: async (username: string) => {
        const user = await UsersAction.findByUsername(username);
        if (!user) throw new Error("User not found");
        const currentUser = await getUser();
        const postIds = user.Posts.map((p) => p.id);

        const [postStates, isFollowed, isReported] = await Promise.all([
            currentUser && postIds.length > 0
                ? PostsAction.getUserStates(currentUser.id, postIds)
                : Promise.resolve(null),
            currentUser && currentUser.id !== user.id
                ? UsersAction.isFollowing(currentUser.id, user.id)
                : Promise.resolve(false),
            currentUser
                ? UsersAction.isReported(currentUser.id, user.id)
                : Promise.resolve(false),
        ]);

        return {
            ...user,
            Posts: user.Posts.map((p) => ({
                ...p,
                isSaved: postStates ? postStates.savedIds.has(p.id) : false,
                isVoted: postStates ? postStates.votedIds.has(p.id) : false,
            })),
            isFollowed,
            isReported,
        };
    },

    toggleFollowUser: async (targetUserId: string) => {
        const currentUser = await getUser();
        if (!currentUser) throw new Error("Unauthorized");
        if (currentUser.id === targetUserId) throw new Error("Cannot follow yourself");
        const target = await UsersAction.findById(targetUserId);
        if (!target) throw new Error("User not found");
        return UsersAction.toggleFollowUser(currentUser.id, targetUserId);
    },

    getFollowStatus: async (targetUserId: string) => {
        const currentUser = await getUser();
        if (!currentUser) return { following: false };
        const following = await UsersAction.isFollowing(currentUser.id, targetUserId);
        return { following };
    },

    reportUser: async (targetUserId: string, reason?: string) => {
        const currentUser = await getUser();
        if (!currentUser) throw new Error("Unauthorized");
        if (currentUser.id === targetUserId) throw new Error("Cannot report yourself");
        const target = await UsersAction.findById(targetUserId);
        if (!target) throw new Error("User not found");
        return UsersAction.reportUser(currentUser.id, targetUserId, reason);
    },

    findAllUsers: async () => {
        const currentUser = await getUser();
        if (!currentUser || currentUser.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        return UsersAction.findAll();
    },

    findByEmail: async (email: string) => {
        const user = await UsersAction.findByEmail(email);
        if (!user) throw new Error("User not found");
        return user;
    },

    createUser: async (data: {
        email: string;
        name?: string;
        firstname?: string;
        lastname?: string;
        username?: string;
        password?: string;
    }) => {
        const currentUser = await getUser();
        if (!currentUser || currentUser.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        if (!data.email) throw new Error("Email is required");

        return UsersAction.create(data);
    },

    updateUser: async (
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
        }
    ) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        const currentUser = await getUser();
        if (!currentUser) throw new Error("Unauthorized");

        if (currentUser.id !== id && currentUser.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        await UsersService.findByIdUser(id);

        return UsersAction.update(id, data);
    },

    updateUserRole: async (id: string, role: "ADMIN" | "MEMBER") => {
        const currentUser = await getUser();
        if (!currentUser || currentUser.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await UsersService.findByIdUser(id);

        return UsersAction.update(id, { role });
    },

    deleteUser: async (id: string) => {
        const currentUser = await getUser();
        if (!currentUser) {
            throw new Error("Unauthorized");
        }

        // Allow users to delete their own account, or admins to delete anyone
        if (currentUser.id !== id && currentUser.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        await UsersService.findByIdUser(id);

        return UsersAction.delete(id);
    },

    initiateEmailChange: async (userId: string, newEmail: string) => {
        // Check newEmail not already in use
        const existing = await UsersAction.findByEmail(newEmail);
        if (existing) throw new Error("EMAIL_ALREADY_IN_USE");

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await UsersAction.savePendingEmailChange(userId, {
            pendingEmail: newEmail,
            emailChangeToken: hashedToken,
            emailChangeTokenExpiresAt: expiresAt,
        });

        return rawToken;
    },

    confirmEmailChange: async (rawToken: string) => {
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const user = await UsersAction.findByEmailChangeToken(hashedToken);

        if (!user) throw new Error("TOKEN_INVALID_OR_EXPIRED");
        if (!user.pendingEmail) throw new Error("NO_PENDING_EMAIL");

        await UsersAction.confirmEmailChange(user.id, user.pendingEmail);

        return user;
    },

    hasCredentialAccount: async (userId: string) => {
        const account = await UsersAction.findCredentialAccount(userId);
        return !!account?.password;
    },

    upsertSocialLink: async (platform: string, url: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        return UsersAction.upsertSocialLink(user.id, platform, url);
    },

    deleteSocialLink: async (platform: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        return UsersAction.deleteSocialLink(user.id, platform);
    },
};