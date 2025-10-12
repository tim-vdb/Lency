"use server"

import { prisma } from "@/lib/prisma";

export const GetImages = async () => {
    return await prisma.gallery.findMany();
}

export const GalleryDeleteAction = async (formData: FormData) => {
    const id = formData.get("id");
    const deleted = await prisma.gallery.delete({
        where: { id: parseInt(id as string) },
    });
    return deleted;
}