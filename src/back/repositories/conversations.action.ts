import { prisma } from "@/back/lib/prisma";

export const ConversationAction = {
  findByParticipants: (userAId: string, userBId: string) =>
    prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: userAId } } },
          { participants: { some: { id: userBId } } },
        ],
      },
      orderBy: { createdAt: "asc" }, // toujours la plus ancienne — déterministe
      include: {
        participants: { select: { id: true, firstname: true, lastname: true, username: true, image: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: { id: true, firstname: true, lastname: true, username: true } } },
        },
      },
    }),

  findByUserId: (userId: string) =>
    prisma.conversation.findMany({
      where: { participants: { some: { id: userId } } },
      include: {
        participants: { select: { id: true, firstname: true, lastname: true, username: true, image: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: { id: true, firstname: true, lastname: true, username: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),

  findById: (id: string) =>
    prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: { select: { id: true, firstname: true, lastname: true, username: true, image: true } },
      },
    }),

  create: (userAId: string, userBId: string) =>
    prisma.conversation.create({
      data: {
        participants: { connect: [{ id: userAId }, { id: userBId }] },
      },
      include: {
        participants: { select: { id: true, firstname: true, lastname: true, username: true, image: true } },
        messages: { take: 1 },
      },
    }),

  findMessages: (conversationId: string, limit = 50) =>
    prisma.directMessage.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, firstname: true, lastname: true, username: true, image: true } } },
      orderBy: { createdAt: "asc" },
      take: limit,
    }),

  createMessage: (data: { conversationId: string; senderId: string; content: string; imageUrls?: string[]; audioUrls?: string[]; videoUrls?: string[] }) =>
    prisma.$transaction([
      prisma.directMessage.create({
        data,
        include: { sender: { select: { id: true, firstname: true, lastname: true, username: true, image: true } } },
      }),
      prisma.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
      }),
    ]),
};
