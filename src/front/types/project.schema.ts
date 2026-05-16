import { Prisma } from "@/back/generated/prisma_client";

export type ProjectWithOwner = Prisma.ProjectGetPayload<{
    include: { owner: true; participants: true; mapLocation: true };
}>;

export type ProjectAttachment = {
    name: string;
    url: string;
};
