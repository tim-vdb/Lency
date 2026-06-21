// Article model not found in Prisma schema

type StubArticle = {
    id: string;
    authorId: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
};

export const ArticlesAction = {
    findById: async (_id: string): Promise<StubArticle | null> => null,
    findAll: async (): Promise<StubArticle[]> => [],
    create: async (_userId: string, _data: { title: string; slug: string; excerpt: string; content: string; image: string }): Promise<StubArticle> => { throw new Error("Article model not implemented"); },
    update: async (_id: string, _data: { title?: string; slug?: string; excerpt?: string; content?: string; image?: string }): Promise<StubArticle> => { throw new Error("Article model not implemented"); },
    delete: async (_id: string): Promise<StubArticle> => { throw new Error("Article model not implemented"); },
};
