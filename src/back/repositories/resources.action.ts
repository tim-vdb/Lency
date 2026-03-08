import prisma from "../lib/prisma";

export const ResourcesAction = {
  findById: async (id: string) => {
    return prisma.resource.findUnique({
      where: { id },
    });
  },

  findAll: async () => {
    return prisma.resource.findMany();
  },

  create: async (
    data: {
      title: string;
      description?: string;
      type: "ASSET" | "TUTORIAL" | "LINK";
      url: string;
      categoryId?: string | null;
    }
  ) => {
    return prisma.resource.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        type: data.type,
        url: data.url,
        ...(data.categoryId
          ? { category: { connect: { id: data.categoryId } } }
          : {}),
      },
    });
  },

  update: async (
    id: string,
    data: {
      title?: string;
      description?: string | null;
      type?: "ASSET" | "TUTORIAL" | "LINK";
      url?: string;
      categoryId?: string | null;
    }
  ) => {
    const updateData: Record<string, unknown> = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.url !== undefined && { url: data.url }),
    };

    if (data.categoryId !== undefined) {
      if (data.categoryId === null) {
        updateData.category = { disconnect: true };
      } else {
        updateData.category = { connect: { id: data.categoryId } };
      }
    }

    return prisma.resource.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id: string) => {
    return prisma.resource.delete({
      where: { id },
    });
  },
};