'use server';

import { prisma } from '@/lib/prisma';
import { actionClient } from '@/lib/safe-action-client';
import { EventsSchema } from './events.schema';
import { getUser } from '@/lib/auth-session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export const EventsSafeAction = actionClient
  .inputSchema(EventsSchema)
  .action(async ({ parsedInput: input }) => {
    const user = await getUser();

    if (!user) {
      // throw new SafeError("Vous devez être connecté pour créer un événement");
      redirect('/login');
    }

    const event = await prisma.event.create({
      data: {
        name: input.name,
        description: input.description,
        location: input.location,
        dateStart: input.dateStart,
        dateEnd: input.dateEnd,
        openAt: input.openAt,
        closeAt: input.closeAt,
        visibleToGuests: input.visibleToGuests,
        maxParticipants: input.maxParticipants,
        creatorId: user.id,
      },
    });

    console.log(event);

    // Revalider les pages qui affichent les événements
    revalidatePath('/events');
    revalidatePath('/');

    return event;
  });
