import { SpotsAction } from "../repositories/spots.action";

export const SpotsService = {
    findByIdSpot: async (id: string) => {
        return SpotsAction.findById(id);
    },

    findAllSpots: async () => {
        return SpotsAction.findAll();
    },

    createSpot: async (data: {
        name: string;
        description: string;
        address: string;
        city: string;
        author: string;
        rating?: number;
        rating_count?: number;
        mapLocationId?: string | null;
    }) => {
        return SpotsAction.create(data);
    },

    updateSpot: async (
        id: string,
        data: {
            name?: string;
            description?: string;
            address?: string;
            city?: string;
            author?: string;
            rating?: number;
            rating_count?: number;
            mapLocationId?: string | null;
        }
    ) => {
        return SpotsAction.update(id, data);
    },

    deleteSpot: async (id: string) => {
        return SpotsAction.delete(id);
    },
};