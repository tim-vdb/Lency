"use server"

import { prisma } from "@/lib/prisma";
import { actionClient, SafeError } from "@/lib/safe-action-client";
import { EventsFormSchema } from "./events.schema";

export const EventsSafeAction = actionClient
    .inputSchema(EventsFormSchema)
    .action(async ({ parsedInput: input }) => {

        if (!input.eventId) {
            throw new SafeError("eventId is required");
        }

        const addToEvent = await prisma.registration.create({
            data: {
                name: input.name,
                email: input.email,
                phone: input.phone || null,
                eventId: input.eventId,

            }
        })

        console.log("hey", addToEvent)

        return addToEvent
    })

export const GetSubscriberAction = async () => {
    return await prisma.registration.findMany();
}