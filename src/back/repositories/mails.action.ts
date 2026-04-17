import { ContactStatus, ContactType } from "../generated/prisma_client";
import prisma from "../lib/prisma"

export const MailsAction = {
    findById: async (id: string) => {
        return prisma.contactMessage.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        });
    },

    findByType: async (type: ContactType) => {
        return prisma.contactMessage.findMany({
            where: { type },
            orderBy: { createdAt: "desc" },
        });
    },

    findByStatus: async (status: ContactStatus) => {
        return prisma.contactMessage.findMany({
            where: { status },
            orderBy: { createdAt: "desc" },
        });
    },

    create: async (data: {
        prenom: string;
        nom: string;
        email: string;
        sujet: string;
        message: string;
        type?: ContactType;
    }) => {
        return prisma.contactMessage.create({
            data: {
                ...data,
                type: data.type ?? ContactType.CONTACT_GENERAL,
            },
        });
    },

    updateStatus: async (id: string, status: ContactStatus) => {
        return prisma.contactMessage.update({
            where: { id },
            data: { status },
        });
    },

    delete: async (id: string) => {
        return prisma.contactMessage.delete({ where: { id } });
    },
};