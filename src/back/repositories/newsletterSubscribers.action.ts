import prisma from "../lib/prisma";

export const NewsletterSubscribersAction = {
  findById: async (id: string) => {
    return prisma.newsletterSubscriber.findUnique({
      where: { id },
    });
  },

  findAll: async () => {
    return prisma.newsletterSubscriber.findMany();
  },

  create: async (data: { email: string; userId?: string | null }) => {
    return prisma.newsletterSubscriber.create({
      data: {
        email: data.email,
        ...(data.userId && { user: { connect: { id: data.userId } } }),
      },
    });
  },

  update: async (
    id: string,
    data: { email?: string; userId?: string | null }
  ) => {
    const updateData: Record<string, unknown> = {
      ...(data.email !== undefined && { email: data.email }),
    };

    if (data.userId !== undefined) {
      if (data.userId === null) {
        updateData.user = { disconnect: true };
      } else {
        updateData.user = { connect: { id: data.userId } };
      }
    }

    return prisma.newsletterSubscriber.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id: string) => {
    return prisma.newsletterSubscriber.delete({
      where: { id },
    });
  },
};