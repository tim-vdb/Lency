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

        const user = await getUser();

        if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const badge = await BadgesService.findByIdBadge(id);

        if (!badge) {
            return NextResponse.json({ error: "Badge not existing" }, { status: 404 });
        }
        return BadgesAction.update(id, data);
    },

    addUserToBadge: async (badgeId: string, userId: string) => {
        return BadgesAction.addUser(badgeId, userId);
    },

    removeUserFromBadge: async (badgeId: string, userId: string) => {
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