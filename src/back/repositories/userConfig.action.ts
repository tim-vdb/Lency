import prisma from "../lib/prisma";

export const UserConfigAction = {
  findById: async (id: string) => {
    return prisma.userConfig.findUnique({
      where: { id },
    });
  },

  findAll: async () => {
    return prisma.userConfig.findMany();
  },

  create: async (
    userId: string,
    data: { title: string; content: any } // content est de type Json
  ) => {
    return prisma.userConfig.create({
      data: {
        title: data.title,
        content: data.content,
        user: { connect: { id: userId } },
      },
    });
  },

  update: async (
    id: string,
    data: {
      title?: string;
      content?: any;
      userId?: string;
    }
  ) => {
    const updateData: Record<string, unknown> = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.content !== undefined && { content: data.content }),
    };

    if (data.userId !== undefined) {
      updateData.user = { connect: { id: data.userId } };
    }

    return prisma.userConfig.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id: string) => {
    return prisma.userConfig.delete({
      where: { id },
    });
  },
};