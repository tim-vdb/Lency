'use server';

import { auth } from '@/back/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/back/lib/prisma';

export const getUser = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return user;
  } catch (error) {
    console.error('[getUser] Error:', error);
    return null;
  }
};
