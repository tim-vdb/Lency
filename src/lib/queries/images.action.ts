import { prisma } from "@/lib/prisma";

export const GetImages = async () => {
    const images = await prisma.gallery.findMany();
    return images;
}