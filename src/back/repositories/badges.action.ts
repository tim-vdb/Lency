// Badge model not found in Prisma schema

type StubBadge = {
    id: string;
    name: string;
    description: string;
    iconUrl: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export const BadgesAction = {
    findById: async (_id: string): Promise<StubBadge | null> => null,
    findAll: async (): Promise<StubBadge[]> => [],
    create: async (_data: { name: string; description: string; iconUrl?: string | null; active?: boolean }): Promise<StubBadge> => { throw new Error("Badge model not implemented"); },
    update: async (_id: string, _data: { name?: string; description?: string; iconUrl?: string | null; active?: boolean }): Promise<StubBadge> => { throw new Error("Badge model not implemented"); },
    addUser: async (_badgeId: string, _userId: string): Promise<StubBadge> => { throw new Error("Badge model not implemented"); },
    removeUser: async (_badgeId: string, _userId: string): Promise<StubBadge> => { throw new Error("Badge model not implemented"); },
    delete: async (_id: string): Promise<StubBadge> => { throw new Error("Badge model not implemented"); },
};
