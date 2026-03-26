import { NextResponse } from "next/server";
import { BadgesAction } from "../repositories/badges.action";
import { getUser } from "../lib/auth-session";

export const BadgesService = {
    findByIdBadge: async (id: string) => {
        const badge = await BadgesAction.findById(id);
        if (!badge) throw new Error("Badge not found");
        return badge;
    },

    findAllBadges: async () => {
        return BadgesAction.findAll();
    },

    createBadge: async (data: {
        name: string;
        description: string;
        iconUrl?: string | null;
        active?: boolean;
    }) => {
        
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }
        if (!data.name) throw new Error("Name is required");
        if (!data.description) throw new Error("Description is required");

        return BadgesAction.create(data);
    },

    updateBadge: async (
        id: string,
        data: {
            name?: string;
            description?: string;
            iconUrl?: string | null;
            active?: boolean;
        }
    ) => {

        if (!data || Object.keys(data).length === 0) {
        throw new Error("No data to update");
        }

        const user = await getUser();

        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await BadgesService.findByIdBadge(id);

        return BadgesAction.update(id, data);
    },

   addUserToBadge: async (badgeId: string, userId: string) => {
    const user = await getUser();
    if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await BadgesService.findByIdBadge(badgeId);

    await BadgesService.findByIdBadge(userId);

    return BadgesAction.addUser(badgeId, userId);
},

removeUserFromBadge: async (badgeId: string, userId: string) => {
    const user = await getUser();
    if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await BadgesService.findByIdBadge(badgeId);

    await BadgesService.findByIdBadge(userId);

    return BadgesAction.removeUser(badgeId, userId);
},

    deleteBadge: async (id: string) => {
        const badge = await BadgesService.findByIdBadge(id);

        if (!badge) {
            return NextResponse.json({ error: "Badge not found" }, { status: 404 });
        }
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return BadgesAction.delete(id);
    },
};