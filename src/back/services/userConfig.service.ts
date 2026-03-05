import { UserConfigAction } from "../repositories/userConfig.action";

export const UserConfigService = {
  findByIdUserConfig: async (id: string) => {
    return UserConfigAction.findById(id);
  },

  findAllUserConfigs: async () => {
    return UserConfigAction.findAll();
  },

  createUserConfig: async (
    userId: string,
    data: { title: string; content: any } // content est de type Json
  ) => {
    return UserConfigAction.create(userId, data);
  },

  updateUserConfig: async (
    id: string,
    data: { title?: string; content?: any; userId?: string }
  ) => {
    return UserConfigAction.update(id, data);
  },

  deleteUserConfig: async (id: string) => {
    return UserConfigAction.delete(id);
  },
};