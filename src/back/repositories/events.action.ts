import prisma from "../lib/prisma";

export const EventsAction = {
    findById: async (id: string) => {
        return prisma.event.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.event.findMany();
    },

    create: async (userId: string, data: {
        title: string;
        description: string;
        location?: string | null;
        startDate: Date;
        endDate: Date;
        participants: number;
        typeEvent: "PHYSICAL" | "VIRTUAL";
    }) => {
        return prisma.event.create({
            data: {
                ...data,
                userId,
            },
        });
    },

    update: async (id: string, data: {
        title?: string;
        description?: string;
        location?: string | null;
        startDate?: Date;
        endDate?: Date;
        participants?: number;
        typeEvent?: "PHYSICAL" | "VIRTUAL";
    }) => {
        return prisma.event.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string) => {
        return prisma.event.delete({ where: { id } });
    },
};