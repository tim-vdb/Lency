import { EventsAction } from "../repositories/events.action";
import { getUser } from "../lib/auth-session";

export const EventsService = {
    findByIdEvent: async (id: string) => {
        const event = await EventsAction.findById(id);
        if (!event) throw new Error("Event not found");
        return event;
    },

    findAllEvents: async () => {
        return EventsAction.findAll();
    },

    createEvent: async (data: {
        title: string;
        description: string;
        location?: string | null;
        startDate: Date;
        endDate: Date;
        participants: number;
    }) => {
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        if (!data.title) throw new Error("Title is required");
        if (!data.description) throw new Error("Description is required");
        if (!data.startDate) throw new Error("Start date is required");
        if (!data.endDate) throw new Error("End date is required");
        if (data.startDate > data.endDate) throw new Error("Start date must be before end date");

        return EventsAction.create(user.id, data);
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
        }
    ) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        if (data.startDate && data.endDate && data.startDate > data.endDate) {
            throw new Error("Start date must be before end date");
        }

        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await EventsService.findByIdEvent(id);

        return EventsAction.update(id, data);
    },

    deleteEvent: async (id: string) => {
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await EventsService.findByIdEvent(id);

        return EventsAction.delete(id);
    },
};