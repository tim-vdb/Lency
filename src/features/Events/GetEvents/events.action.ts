'use server';

import { prisma } from '@/lib/prisma';

export const GetEvents = async () => {
  return await prisma.event.findMany({
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
};

export const DeleteEventAction = async (id: string) => {
  try {
    const deleted = await prisma.event.delete({
      where: { id },
    });
    return { success: true, deleted };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: 'Failed to delete event' };
  }
};
