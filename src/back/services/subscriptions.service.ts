import { SubscriptionsAction } from "../repositories/subscriptions.action";
import { getUser } from "../lib/auth-session";

export const SubscriptionsService = {
    findByIdSubscription: async (id: string) => {
        const subscription = await SubscriptionsAction.findById(id);
        if (!subscription) throw new Error("Subscription not found");
        return subscription;
    },

    findByUserIdSubscription: async (userId: string) => {
        const subscription = await SubscriptionsAction.findByUserId(userId);
        if (!subscription) throw new Error("Subscription not found");
        return subscription;
    },

    findAllSubscriptions: async () => {
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }
        return SubscriptionsAction.findAll();
    },

    createSubscription: async (data: {
        status: "ACTIVE" | "CANCELED" | "EXPIRED";
        startedAt: Date;
        endedAt?: Date | null;
        targetUserId?: string;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");


        if (!data.startedAt) throw new Error("Start date is required");
        if (data.endedAt && data.startedAt > data.endedAt) {
            throw new Error("Start date must be before end date");
        }

        const targetUserId = user.role === "ADMIN" && data.targetUserId
            ? data.targetUserId
            : user.id;

        const existing = await SubscriptionsAction.findByUserId(targetUserId);
        if (existing && existing.status === "ACTIVE") {
            throw new Error("User already has an active subscription");
        }

        const { targetUserId: _, ...subscriptionData } = data;

        return SubscriptionsAction.create(targetUserId, {
            ...subscriptionData,
            status: data.status ?? "ACTIVE",
        });
    },

    updateSubscription: async (id: string, data: {
        status?: "ACTIVE" | "CANCELED" | "EXPIRED";
        startedAt?: Date;
        endedAt?: Date | null;
    }) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await SubscriptionsService.findByIdSubscription(id);

        return SubscriptionsAction.update(id, data);
    },

    deleteSubscription: async (id: string) => {
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await SubscriptionsService.findByIdSubscription(id);

        return SubscriptionsAction.delete(id);
    },
};