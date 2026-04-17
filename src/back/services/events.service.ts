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
        typeEvent: "PHYSICAL" | "VIRTUAL";
    }) => {
        // 1. Auth
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        // 2. Validation
        if (!data.title) throw new Error("Title is required");
        if (!data.description) throw new Error("Description is required");
        if (!data.startDate) throw new Error("Start date is required");
        if (!data.endDate) throw new Error("End date is required");
        if (data.startDate > data.endDate) throw new Error("Start date must be before end date");
        if (!data.typeEvent) throw new Error("Event type is required");

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
            typeEvent?: "PHYSICAL" | "VIRTUAL";
        }
    ) => {
        // 1. Validation
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        if (data.startDate && data.endDate && data.startDate > data.endDate) {
            throw new Error("Start date must be before end date");
        }

        // 2. Auth
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        // 3. Existence
        await EventsService.findByIdEvent(id);

        return EventsAction.update(id, data);
    },

    deleteEvent: async (id: string) => {
        // 1. Auth
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        // 2. Existence
        await EventsService.findByIdEvent(id);

        return EventsAction.delete(id);
    },
};