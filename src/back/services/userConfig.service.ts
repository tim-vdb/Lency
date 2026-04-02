import { UserConfigAction } from "../repositories/userConfig.action";
import { getUser } from "../lib/auth-session";
import { Prisma } from "../generated/prisma_client";

export const UserConfigService = {
    findByIdUserConfig: async (id: string) => {
        const config = await UserConfigAction.findById(id);
        if (!config) throw new Error("UserConfig not found");
        return config;
    },

    findAllUserConfigs: async () => {
        const user = await getUser();
        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }
        return UserConfigAction.findAll();
    },

    findUserConfigs: async () => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        return UserConfigAction.findByUserId(user.id);
    },

    createUserConfig: async (data: {
        title: string;
        content: Prisma.InputJsonValue;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        if (!data.title) throw new Error("Title is required");
        if (!data.content) throw new Error("Content is required");

        return UserConfigAction.create(user.id, data);
    },

    updateUserConfig: async (id: string, data: {
        title?: string;
        content?: Prisma.InputJsonValue;
    }) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const config = await UserConfigService.findByIdUserConfig(id);
        if (config.userId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return UserConfigAction.update(id, data);
    },

    deleteUserConfig: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const config = await UserConfigService.findByIdUserConfig(id);
        if (config.userId !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return UserConfigAction.delete(id);
    },
};
