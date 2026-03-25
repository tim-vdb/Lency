import { CategoriesAction } from "../repositories/categories.action";

export const CategoriesService = {
    findByIdCategory: async (id: string) => {
        return CategoriesAction.findById(id);
    },
    findAllCategories: async () => {
        return CategoriesAction.findAll();
    },
    createCategory: async (userId: string, data: { name: string, slug: string, description?: string, iconUrl?: string, bannerUrl?: string, rules?: string, lastPostAt?: Date }) => {
        return CategoriesAction.create(userId, data);
    },
    updateCategory: async (id: string, data: { name?: string, slug?: string, description?: string, iconUrl?: string, bannerUrl?: string, rules?: string, lastPostAt?: Date }) => {
        return CategoriesAction.update(id, data);
    },
    deleteCategory: async (id: string) => {
        return CategoriesAction.delete(id);
    },
}

