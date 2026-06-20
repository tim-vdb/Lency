// Article model not found in Prisma schema - this file is deprecated
// import prisma from "../lib/prisma"

// export const ArticlesAction = {
//     findById: async (id: string) => {
//         return prisma.article.findUnique({ where: { id } });
//     },

//     findAll: async () => {
//         return prisma.article.findMany();
//     },

//     create: async (userId: string, data: {
//         title: string;
//         slug: string;
//         excerpt: string;
//         content: string;
//         image: string;
//     }) => {
//         return prisma.article.create({
//             data: {
//                 ...data,
//                 authorId: userId,
//             }
//         });
//     },

//     update: async (id: string, data: {
//         title?: string;
//         slug?: string;
//         excerpt?: string;
//         content?: string;
//         image?: string;
//     }) => {
//         return prisma.article.update({
//             where: { id },
//             data,
//         });
//     },

//     delete: async (id: string) => {
//         return prisma.article.delete({ where: { id } });
//     },
// };

export const ArticlesAction = {};