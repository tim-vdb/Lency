import { SpotsAction } from "../repositories/spots.action";
import { getUser } from "../lib/auth-session";

export const SpotsService = {
    findByIdSpot: async (id: string) => {
        const spot = await SpotsAction.findById(id);
        if (!spot) throw new Error("Spot not found");
        return spot;
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
        mapLocationId?: string | null;
    }) => {
        if (!data.name) throw new Error("Name is required");
        if (!data.description) throw new Error("Description is required");
        if (!data.address) throw new Error("Address is required");
        if (!data.city) throw new Error("City is required");
        if (!data.author) throw new Error("Author is required");

        const user = await getUser();

        return SpotsAction.create(user?.id ?? null, data);
    },

    updateSpot: async (id: string, data: {
        name?: string;
        description?: string;
        address?: string;
        city?: string;
        mapLocationId?: string | null;
    }) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const spot = await SpotsService.findByIdSpot(id);
        if (spot.userId !== user.id) {
            throw new Error("Forbidden");
        }

        return SpotsAction.update(id, data);
    },

    rateSpot: async (id: string, rating: number) => {
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        await SpotsService.findByIdSpot(id);

        return SpotsAction.rate(id, rating);
    },

    deleteSpot: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const spot = await SpotsService.findByIdSpot(id);
        if (spot.userId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return SpotsAction.delete(id);
    },
};