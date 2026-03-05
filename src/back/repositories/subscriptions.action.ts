import prisma from "../lib/prisma";

export const SubscriptionsAction = {
  findById: async (id: string) => {
    return prisma.subscription.findUnique({
      where: { id }
    });
  },

  findAll: async () => {
    return prisma.subscription.findMany();
  },

  create: async (
    userId: string,
    data: { status: "ACTIVE" | "CANCELED" | "EXPIRED"; startedAt: Date; endedAt?: Date | null }
  ) => {
    return prisma.subscription.create({
      data: {
        user: { connect: { id: userId } },
        ...data,
      },
    });
  },

  update: async (
    id: string,
    data: {
      status?: "ACTIVE" | "CANCELED" | "EXPIRED";
      startedAt?: Date;
      endedAt?: Date | null;
      userId?: string;
    }
  ) => {
    const updateData: Record<string, unknown> = {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.startedAt !== undefined && { startedAt: data.startedAt }),
      ...(data.endedAt !== undefined && { endedAt: data.endedAt }),
    };

    if (data.userId !== undefined) {
      updateData.user = { connect: { id: data.userId } };
    }

    return prisma.subscription.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id: string) => {
    return prisma.subscription.delete({
      where: { id },
    });
  },
};