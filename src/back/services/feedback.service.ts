import { getUser } from "@/back/lib/auth-session";
import { FeedbackAction } from "@/back/repositories/feedback.action";

export const FeedbackService = {
    findAll: async () => {
        const user = await getUser();
        if (!user || user.role !== "ADMIN") throw new Error("Unauthorized");
        return FeedbackAction.findAll();
    },

    create: async (data: { description: string; imageUrl?: string }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        return FeedbackAction.create({
            description: data.description,
            imageUrl: data.imageUrl,
            user: { connect: { id: user.id } },
        });
    },
};
