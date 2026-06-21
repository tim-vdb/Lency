// Spot model not found in Prisma schema

type StubSpot = {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    author: string;
    rating: number;
    rating_count: number;
    userId: string | null;
    mapLocationId: string | null;
    createdAt: Date;
    updatedAt: Date;
    mapLocation: null;
};

export const SpotsAction = {
    findById: async (_id: string): Promise<StubSpot | null> => null,

    findAll: async (): Promise<StubSpot[]> => [],

    create: async (
        _userId: string | null,
        _data: {
            name: string;
            description: string;
            address: string;
            city: string;
            author: string;
            mapLocation: {
                name: string;
                latitude: number;
                longitude: number;
                description?: string;
            };
        }
    ): Promise<StubSpot> => { throw new Error("Spot model not implemented"); },

    update: async (_id: string, _data: {
        name?: string;
        description?: string;
        address?: string;
        city?: string;
        mapLocation?: {
            name?: string;
            latitude?: number;
            longitude?: number;
            description?: string;
        };
    }): Promise<StubSpot> => { throw new Error("Spot model not implemented"); },

    rate: async (_id: string, _rating: number): Promise<StubSpot> => { throw new Error("Spot model not implemented"); },

    delete: async (_id: string): Promise<StubSpot> => { throw new Error("Spot model not implemented"); },
};
