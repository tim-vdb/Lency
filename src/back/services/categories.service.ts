import { CategoriesAction } from "../repositories/categories.action";
import { getUser } from "../lib/auth-session";

export const CategoriesService = {
    findByIdCategory: async (id: string) => {
        const category = await CategoriesAction.findById(id);
        if (!category) throw new Error("Category not found");
        return category;
    },

    findAllCategories: async () => {
        return CategoriesAction.findAll();
    },

    createCategory: async (data: {
        name: string;
        slug: string;
        description?: string;
        iconUrl?: string;
        bannerUrl?: string;
        rules?: string;
        lastPostAt?: Date;
    }) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        if (!data.name) throw new Error("Name is required");
        if (!data.slug) throw new Error("Slug is required");

        return CategoriesAction.create(user.id, data);
    },

    updateCategory: async (id: string, data: {
        name?: string;
        slug?: string;
        description?: string;
        iconUrl?: string;
        bannerUrl?: string;
        rules?: string;
        lastPostAt?: Date;
    }) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const category = await CategoriesService.findByIdCategory(id);
        if (category.createdBy !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return CategoriesAction.update(id, data);
    },

    deleteCategory: async (id: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const category = await CategoriesService.findByIdCategory(id);
        if (category.createdBy !== user.id && user.role !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return CategoriesAction.delete(id);
    },

    findBySlugCategory: async (slug: string) => {
        const category = await CategoriesAction.findBySlug(slug);
        if (!category) throw new Error("Category not found");
        return category;
    },

    findPostsByCategory: async (categoryId: string) => {
        const user = await getUser();
        return CategoriesAction.findPostsByCategoryId(categoryId, user?.id ?? undefined);
    },

    toggleFollowCategory: async (categoryId: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        await CategoriesService.findByIdCategory(categoryId);
        return CategoriesAction.toggleFollow(user.id, categoryId);
    },

    getFollowStatus: async (categoryId: string) => {
        const user = await getUser();
        if (!user) return { following: false };
        return { following: await CategoriesAction.isFollowing(user.id, categoryId) };
    },

    findFollowedCategoryPosts: async () => {
        const user = await getUser();
        if (!user) return [];
        return CategoriesAction.findFollowedCategoryPosts(user.id);
    },

    findFollowedCategories: async () => {
        const user = await getUser();
        if (!user) return [];
        return CategoriesAction.findFollowedCategories(user.id);
    },
};