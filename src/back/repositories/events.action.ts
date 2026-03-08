import prisma from "../lib/prisma";

export const EventsAction = {
    findById: async (id: string) => {
        return prisma.event.findUnique({ where: { id } });
    },
    findAll: async () => {
        return prisma.event.findMany();
    },
    create: async (
        userId: string,
        data: {
            title: string
            description: string
            location?: string | null
            startDate: Date
            endDate: Date
            participants: number
        }
    ) => {
        return prisma.event.create({
            data: {
                ...data,
                userId: userId,
            },
        });
    },

    update: async (
        id: string,
        data: {
            title?: string;
            description?: string;
            location?: string | null;
            startDate?: Date;
            endDate?: Date;
            participants?: number;
            userId?: string | null;
        }
    ) => {
        const updateData: Record<string, unknown> = {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.location !== undefined && { location: data.location }),
            ...(data.startDate !== undefined && { startDate: data.startDate }),
            ...(data.endDate !== undefined && { endDate: data.endDate }),
            ...(data.participants !== undefined && { participants: data.participants }),
        };

        if (data.userId !== undefined) {
            updateData.users = { connect: { id: data.userId } };
        }

        return prisma.event.update({ where: { id }, data: updateData });
    },

    delete: async (id: string) => {
        return prisma.event.delete({ where: { id } });
    },
}

