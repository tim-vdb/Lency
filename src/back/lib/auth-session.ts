'use server';

import { auth } from '@/back/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/back/lib/prisma';

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  // Récupérer les données complètes de l'utilisateur depuis la base de données
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return user;
};
