import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchMyConfigs,
    createUserConfig,
    updateUserConfig,
    deleteUserConfig,
    type UserConfig,
} from "@/front/lib/api/userConfigs";

const CONFIG_ROOT = ["userConfigs"] as const;

export const userConfigQueries = {
    mine: () =>
        queryOptions({
            queryKey: [...CONFIG_ROOT, "me"] as const,
            queryFn: fetchMyConfigs,
            staleTime: 1000 * 60 * 5,
        }),
};

export const useMyConfigs = () => useQuery(userConfigQueries.mine());

export const useCreateUserConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { title: string; content: Record<string, unknown> }) =>
            createUserConfig(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CONFIG_ROOT }),
    });
};

export const useUpdateUserConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { title?: string; content?: Record<string, unknown> } }) =>
            updateUserConfig(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CONFIG_ROOT }),
    });
};

export const useDeleteUserConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteUserConfig(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: userConfigQueries.mine().queryKey });
            const previous = queryClient.getQueryData<UserConfig[]>(userConfigQueries.mine().queryKey);
            queryClient.setQueryData(
                userConfigQueries.mine().queryKey,
                (old: UserConfig[] = []) => old.filter((c) => c.id !== id)
            );
            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(userConfigQueries.mine().queryKey, context.previous);
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: CONFIG_ROOT }),
    });
};
