// NewsletterSubscriber model not found in Prisma schema

type StubSubscriber = {
    id: string;
    email: string;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export const NewsletterSubscribersAction = {
    findById: async (_id: string): Promise<StubSubscriber | null> => null,
    findByEmail: async (_email: string): Promise<StubSubscriber | null> => null,
    findAll: async (): Promise<StubSubscriber[]> => [],
    create: async (_data: { email: string; userId?: string | null }): Promise<StubSubscriber> => { throw new Error("NewsletterSubscriber model not implemented"); },
    delete: async (_id: string): Promise<StubSubscriber> => { throw new Error("NewsletterSubscriber model not implemented"); },
};
