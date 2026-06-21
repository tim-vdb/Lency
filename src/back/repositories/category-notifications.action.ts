import prisma from "../lib/prisma";

export const CategoryNotificationsAction = {
    isSubscribed: (userId: string, categoryId: string) =>
        prisma.categoryNotificationSubscription.findUnique({
            where: { userId_categoryId: { userId, categoryId } },
        }),

    subscribe: (userId: string, categoryId: string) =>
        prisma.categoryNotificationSubscription.create({
            data: { userId, categoryId },
        }),

    unsubscribe: (userId: string, categoryId: string) =>
        prisma.categoryNotificationSubscription.delete({
            where: { userId_categoryId: { userId, categoryId } },
        }),

    findSubscriberIds: (categoryId: string): Promise<string[]> =>
        prisma.categoryNotificationSubscription
            .findMany({ where: { categoryId }, select: { userId: true } })
            .then((rows) => rows.map((r) => r.userId)),
};
