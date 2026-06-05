import { prisma } from "@/back/lib/prisma";
import { Prisma } from "@/back/generated/prisma_client";

export const FeedbackAction = {
    findAll: () =>
        prisma.feedback.findMany({
            include: { user: { select: { id: true, name: true, email: true, image: true } } },
            orderBy: { createdAt: "desc" },
        }),

    create: (data: Prisma.FeedbackCreateInput) =>
        prisma.feedback.create({ data }),
};
