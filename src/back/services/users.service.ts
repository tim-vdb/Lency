<<<<<<< HEAD
import { UsersAction } from '../repositories/users.action';

export const UsersService = {
  findByEmail: async (email: string) => {
    return UsersAction.findByEmail(email);
  },
};
=======
import { UsersAction } from "../repositories/users.action";
import { getUser } from "../lib/auth-session";

export const UsersService = {
    findByIdUser: async (id: string) => {
        const user = await UsersAction.findById(id);
        if (!user) throw new Error("User not found");
        return user;
    },

    findAllUsers: async () => {
        const currentUser = await getUser();
        if (!currentUser || currentUser.role !== "ADMIN") {
           throw new Error("Unauthorized");
        }

        return UsersAction.findAll();
    },

    createUser: async (data: {
        email: string;
        name?: string;
        firstname?: string;
        lastname?: string;
        username?: string;
        password?: string;
    }) => {
        const currentUser = await getUser();
        if (!currentUser || currentUser.role !== "ADMIN") {
            throw new Error("Unauthorized");
       }

        if (!data.email) throw new Error("Email is required");

        return UsersAction.create(data);
    },

    updateUser: async (
        id: string,
        data: {
            name?: string;
            firstname?: string;
            lastname?: string;
            username?: string;
            phone?: string;
            bio?: string;
            avatarUrl?: string;
            cv?: string;
            portfolio?: string;
        }
    ) => {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data to update");
        }

        const currentUser = await getUser();
       if (!currentUser) throw new Error("Unauthorized");

        if (currentUser.id !== id && currentUser.role !== "ADMIN") {
           throw new Error("Forbidden");
        }

        await UsersService.findByIdUser(id);

        return UsersAction.update(id, data);
    },

    updateUserRole: async (id: string, role: "ADMIN" | "MEMBER") => {
        const currentUser = await getUser();
        if (!currentUser || currentUser.role !== "ADMIN") {
           throw new Error("Unauthorized");
        }

        await UsersService.findByIdUser(id);

        return UsersAction.update(id, { role });
    },

    deleteUser: async (id: string) => {
        const currentUser = await getUser();
        if (!currentUser || currentUser.role !== "ADMIN") {
           throw new Error("Unauthorized");
        }

        await UsersService.findByIdUser(id);

        return UsersAction.delete(id);
    },
};
>>>>>>> 69e933f (feat(core): users route, action and service)
