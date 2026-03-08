import { EventsAction } from "../repositories/events.action";

export const EventsService = {
    findByIdEvent: async (id: string) => {
        return EventsAction.findById(id);
    },

    findAllEvents: async () => {
        return EventsAction.findAll();
    },

    createEvent: async (
        userId: string,
        data: {
            title: string;
            description: string;
            location?: string | null;
            startDate: Date;
            endDate: Date;
            participants: number;
        }
    ) => {
        return EventsAction.create(userId, data);
    },

    updateEvent: async (
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
        return EventsAction.update(id, data);
    },

    deleteEvent: async (id: string) => {
        return EventsAction.delete(id);
    },
};