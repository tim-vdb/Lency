import { ResourcesAction } from "../repositories/resources.action";

export const ResourcesService = {
  findByIdResource: async (id: string) => {
    return ResourcesAction.findById(id);
  },

  findAllResources: async () => {
    return ResourcesAction.findAll();
  },

  createResource: async (data: {
    title: string;
    description?: string;
    type: "ASSET" | "TUTORIAL" | "LINK";
    url: string;
    categoryId?: string | null;
  }) => {
    return ResourcesAction.create(data);
  },

  updateResource: async (
    id: string,
    data: {
      title?: string;
      description?: string | null;
      type?: "ASSET" | "TUTORIAL" | "LINK";
      url?: string;
      categoryId?: string | null;
    }
  ) => {
    return ResourcesAction.update(id, data);
  },

  deleteResource: async (id: string) => {
    return ResourcesAction.delete(id);
  },
};