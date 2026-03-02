import prisma from "../lib/prisma";

export const ProjectsAction = {
    findById: async (id: string) => {
        return prisma.project.findUnique({ where: { id } });
    },
    findAll: async () => {
        return prisma.project.findMany();
    },
    create: async (userId: string, data: { title: string, description: string, mapLocationId: string | null }) => {
        return prisma.project.create({
            data: {
                title: data.title,
                description: data.description,
                mapLocationId: data.mapLocationId,
                ownerId: userId,
            },
        });
    },

    update: async (
        id: string,
        data: {
            title?: string;
            description?: string;
            updatedAt?: Date;
            status?: string;
            ownerId?: string;
            mapLocationId?: string | null;
        }
    ) => {
        const updateData: Record<string, unknown> = {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.status !== undefined && { status: data.status }),
        };

        if (data.ownerId !== undefined) {
            // map ownerId -> relation update
            updateData.owner = { connect: { id: data.ownerId } };
        }

        if (data.mapLocationId !== undefined) {
            if (data.mapLocationId === null) {
                updateData.mapLocation = { disconnect: true };
            } else {
                updateData.mapLocation = { connect: { id: data.mapLocationId } };
            }
        }

        return prisma.project.update({ where: { id }, data: updateData });
    },


    delete: async (id: string) => {
        return prisma.project.delete({ where: { id } });
    },
}

