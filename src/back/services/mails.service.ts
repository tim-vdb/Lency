import { MailsAction } from "../repositories/mails.action";
import { getUser } from "../lib/auth-session";
import { ContactStatus, ContactType } from "../generated/prisma_client";


export const MailsService = {
    findByIdMail: async (id: string) => {
        const mail = await MailsAction.findById(id);
        if (!mail) throw new Error("Message not found");
        return mail;
    },

    findAllMails: async () => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        if (user.role !== "ADMIN") throw new Error("Forbidden");

        return MailsAction.findAll();
    },

    findMailsByType: async (type: ContactType) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        if (user.role !== "ADMIN") throw new Error("Forbidden");

        return MailsAction.findByType(type);
    },

    findMailsByStatus: async (status: ContactStatus) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        if (user.role !== "ADMIN") throw new Error("Forbidden");

        return MailsAction.findByStatus(status);
    },

    createMail: async (data: {
        prenom: string;
        nom: string;
        email: string;
        sujet: string;
        message: string;
        type?: ContactType;
    }) => {
        if (!data.prenom || data.prenom.trim().length < 2)
            throw new Error("Prénom invalide");
        if (!data.nom || data.nom.trim().length < 2)
            throw new Error("Nom invalide");
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
            throw new Error("Email invalide");
        if (!data.sujet || data.sujet.trim().length < 3)
            throw new Error("Sujet trop court");
        if (!data.message || data.message.trim().length < 10)
            throw new Error("Message trop court");

        return MailsAction.create(data);
    },

    updateMailStatus: async (id: string, status: ContactStatus) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        if (user.role !== "ADMIN") throw new Error("Forbidden");

        await MailsService.findByIdMail(id);

        return MailsAction.updateStatus(id, status);
    },

    deleteMail: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        if (user.role !== "ADMIN") throw new Error("Forbidden");

        await MailsService.findByIdMail(id);

        return MailsAction.delete(id);
    },
};