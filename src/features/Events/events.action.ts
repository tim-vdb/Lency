"use server"

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action-client'
import { EventsSchema } from './events.schema'
import { getUser } from '@/lib/auth-session'

export const EventsSafeAction = actionClient
    .inputSchema(EventsSchema)
    .action(async ({ parsedInput: input }) => {

        const user = await getUser();
        const event = await prisma.event.create({
            data: {
                name: input.name,
                description: input.description,
                image: input.image,
                location: input.location,
                dateStart: input.dateStart,
                dateEnd: input.dateEnd,
                openAt: input.openAt,
                closeAt: input.closeAt,
                visibleToGuests: input.visibleToGuests,
                maxParticipants: input.maxParticipants,
                creatorId: user?.id,
            }
        })

        console.log(event)
        return event
    })
