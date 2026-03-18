import prisma from '../lib/prisma';

export const UsersAction = {
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      select: { firstname: true },
    });
  },
};
