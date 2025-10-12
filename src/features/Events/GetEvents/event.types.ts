import { Event } from '@/generated/prisma_client'

export type EventWithCreator = Event & {
    creator: {
        name: string;
        email: string;
    } | null;
}
