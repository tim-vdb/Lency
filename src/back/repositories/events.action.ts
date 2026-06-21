// Event model not found in Prisma schema

type StubEvent = {
    id: string;
    title: string;
    description: string;
    location: string | null;
    startDate: Date;
    endDate: Date;
    participants: number;
    typeEvent: "PHYSICAL" | "VIRTUAL";
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};

export const EventsAction = {
    findById: async (_id: string): Promise<StubEvent | null> => null,
    findAll: async (): Promise<StubEvent[]> => [],
    create: async (_userId: string, _data: {
        title: string;
        description: string;
        location?: string | null;
        startDate: Date;
        endDate: Date;
        participants: number;
        typeEvent: "PHYSICAL" | "VIRTUAL";
    }): Promise<StubEvent> => { throw new Error("Event model not implemented"); },
    update: async (_id: string, _data: {
        title?: string;
        description?: string;
        location?: string | null;
        startDate?: Date;
        endDate?: Date;
        participants?: number;
        typeEvent?: "PHYSICAL" | "VIRTUAL";
    }): Promise<StubEvent> => { throw new Error("Event model not implemented"); },
    delete: async (_id: string): Promise<StubEvent> => { throw new Error("Event model not implemented"); },
};