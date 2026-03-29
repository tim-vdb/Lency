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
        mapLocation: {
            name: string;
            latitude: number;
            longitude: number;
            description?: string;
        };
    }) => {
        // 1. Validation spot
        if (!data.name) throw new Error("Name is required");
        if (!data.description) throw new Error("Description is required");
        if (!data.address) throw new Error("Address is required");
        if (!data.city) throw new Error("City is required");
        if (!data.author) throw new Error("Author is required");

        // 2. Validation mapLocation
        if (!data.mapLocation) throw new Error("Map location is required");
        if (!data.mapLocation.name) throw new Error("Location name is required");
        if (data.mapLocation.latitude === undefined) throw new Error("Latitude is required");
        if (data.mapLocation.longitude === undefined) throw new Error("Longitude is required");

        // 3. Auth optionnelle
        const user = await getUser();

        return SpotsAction.create(user?.id ?? null, data);
    },

    updateSpot: async (id: string, data: {
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
    }) => {
        // 1. Validation
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        // 2. Auth
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        // 3. Existence + permission
        const spot = await SpotsService.findByIdSpot(id);
        if (spot.userId !== user.id) {
            throw new Error("Forbidden");
        }

        return SpotsAction.update(id, data);
    },

    rateSpot: async (id: string, rating: number) => {
        // 1. Validation
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        // 2. Existence
        await SpotsService.findByIdSpot(id);

        return SpotsAction.rate(id, rating);
    },

    deleteSpot: async (id: string) => {
        // 1. Auth
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        // 2. Existence + permission
        const spot = await SpotsService.findByIdSpot(id);
        if (spot.userId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return SpotsAction.delete(id);
    },
};