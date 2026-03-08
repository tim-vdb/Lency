import { BadgesAction } from "../repositories/badges.action";

export const BadgeService = {
    findByIdBadge: async (id: string) => {
        return BadgesAction.findById(id);
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
        return BadgesAction.update(id, data);
    },

    addUserToBadge: async (badgeId: string, userId: string) => {
        return BadgesAction.addUser(badgeId, userId);
    },

    removeUserFromBadge: async (badgeId: string, userId: string) => {
        return BadgesAction.removeUser(badgeId, userId);
    },

    deleteBadge: async (id: string) => {
        return BadgesAction.delete(id);
    },
};