import prisma from "../lib/prisma";

export const SpotsAction = {
    findById: async (id: string) => {
        return prisma.spot.findUnique({
            where: { id },
            include: { mapLocation: true },
        });
    },

    findAll: async () => {
        return prisma.spot.findMany({
            include: { mapLocation: true },
        });
    },

   create: async (
  userId: string | null,
  data: {
    name: string;
    description: string;
    address: string;
    city: string;
    author: string;
    mapLocation: {
      name: string;
      latitude: number;
      longitude: number;
      description?: string;
    };
  }
) => {
  return prisma.spot.create({
    data: {
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      author: data.author,

      user: userId
        ? { connect: { id: userId } }
        : undefined,

      mapLocation: {
        create: data.mapLocation,
      },
    },
    include: { mapLocation: true },
  });
},

    update: async (id: string, data: {
        name?: string;
        description?: string;
        address?: string;
        city?: string;
        mapLocation?: {
            name?: string;
            latitude?: number;
            longitude?: number;
            description?: string;
        };
    }) => {
        return prisma.spot.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                address: data.address,
                city: data.city,
                ...(data.mapLocation && {
                    mapLocation: {
                        update: data.mapLocation,
                    }
                }),
            },
            include: { mapLocation: true },
        });
    },

    rate: async (id: string, rating: number) => {
        const spot = await prisma.spot.findUnique({ where: { id } });
        if (!spot) throw new Error("Spot not found");

        const newCount = spot.rating_count + 1;
        const newRating = Math.round((spot.rating * spot.rating_count + rating) / newCount);

        return prisma.spot.update({
            where: { id },
            data: {
                rating: newRating,
                rating_count: newCount,
            },
        });
    },

    delete: async (id: string) => {
        return prisma.spot.delete({ where: { id } });
    },
};