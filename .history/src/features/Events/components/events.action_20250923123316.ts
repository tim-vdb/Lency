"use server"

import { prisma } from "@/lib/prisma"

export const GetEvents = async () => {
    return await prisma.event.findMany();
}