import prisma from "../lib/prisma";

export const BadgesAction = {
    findById: async (id: string) => {
        return prisma.badge.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.badge.findMany();
    },

    create: async (data: { name: string; description: string; iconUrl?: string | null; active?: boolean }) => {
        return prisma.badge.create({
            data: {
                ...data,
            },
        });
    },

    update: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      iconUrl?: string | null;
      active?: boolean;
    }
  ) => {
    const updateData: Record<string, unknown> = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.active !== undefined && { active: data.active }),
    };

    if (data.iconUrl !== undefined) {
      updateData.iconUrl = data.iconUrl; // peut être string ou null
    }

    return prisma.badge.update({
      where: { id },
      data: updateData,
    });
  },

    // Add a user to a badge
    addUser: async (badgeId: string, userId: string) => {
        return prisma.badge.update({
            where: { id: badgeId },
            data: {
                users: { connect: { id: userId } },
            },
        });
    },

    // Remove a user from a badge
    removeUser: async (badgeId: string, userId: string) => {
        return prisma.badge.update({
            where: { id: badgeId },
            data: {
                users: { disconnect: { id: userId } },
            },
        });
    },

    delete: async (id: string) => {
        return prisma.badge.delete({ where: { id } });
    },
};