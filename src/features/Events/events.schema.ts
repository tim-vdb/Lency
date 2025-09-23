import { z } from "zod";

export const EventsSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1).optional(),
    location: z.string().min(1),
    dateStart: z.date(),
    dateEnd: z.date(),
    openAt: z.date(),
    closeAt: z.date(),
    visibleToGuests: z.boolean().optional(),
    maxParticipants: z.number().min(1),

})