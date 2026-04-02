import { NewsletterSubscribersAction } from "../repositories/newsletterSubscribers.action";
import { getUser } from "../lib/auth-session";

export const NewsletterSubscribersService = {
    findByIdSubscriber: async (id: string) => {
        const subscriber = await NewsletterSubscribersAction.findById(id);
        if (!subscriber) throw new Error("Subscriber not found");
        return subscriber;
    },

    findAllSubscribers: async () => {
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        return NewsletterSubscribersAction.findAll();
    },

    createSubscriber: async (data: {
        email: string;
        userId?: string | null;
    }) => {
        if (!data.email) throw new Error("Email is required");

        const existing = await NewsletterSubscribersAction.findByEmail(data.email);
        if (existing) throw new Error("Email already subscribed");

        return NewsletterSubscribersAction.create(data);
    },

    deleteSubscriber: async (id: string) => {
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await NewsletterSubscribersService.findByIdSubscriber(id);

        return NewsletterSubscribersAction.delete(id);
    },
};