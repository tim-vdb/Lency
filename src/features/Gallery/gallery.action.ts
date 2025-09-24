"use server"

import { prisma } from "@/lib/prisma";

export const GetImages = async () => {
    return await prisma.gallery.findMany();
}