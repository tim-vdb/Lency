import prisma from "../lib/prisma";

export const MapLocationsAction = {
  findById: async (id: string) => {
    return prisma.mapLocation.findUnique({
      where: { id },
      include: { Spots: true, Projects: true }, // inclut les relations
    });
  },

  findAll: async () => {
    return prisma.mapLocation.findMany({
      include: { Spots: true, Projects: true },
    });
  },

  create: async (data: {
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
  }) => {
    return prisma.mapLocation.create({
      data: {
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description ?? null,
      },
    });
  },

  update: async (
    id: string,
    data: {
      name?: string;
      latitude?: number;
      longitude?: number;
      description?: string | null;
    }
  ) => {
    const updateData: Record<string, unknown> = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.latitude !== undefined && { latitude: data.latitude }),
      ...(data.longitude !== undefined && { longitude: data.longitude }),
      ...(data.description !== undefined && { description: data.description }),
    };

    return prisma.mapLocation.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id: string) => {
    return prisma.mapLocation.delete({
      where: { id },
    });
  },
};