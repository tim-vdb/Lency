import prisma from "../lib/prisma";

export const NewsletterSubscribersAction = {
    findById: async (id: string) => {
        return prisma.newsletterSubscriber.findUnique({ where: { id } });
    },

    findByEmail: async (email: string) => {
        return prisma.newsletterSubscriber.findUnique({ where: { email } });
    },

    findAll: async () => {
        return prisma.newsletterSubscriber.findMany();
    },

    create: async (data: {
        email: string;
        userId?: string | null;
    }) => {
        return prisma.newsletterSubscriber.create({
            data: {
                email: data.email,
                ...(data.userId && { user: { connect: { id: data.userId } } }),
            },
        });
    },

    delete: async (id: string) => {
        return prisma.newsletterSubscriber.delete({ where: { id } });
    },
};