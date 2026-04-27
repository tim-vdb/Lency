import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createProject,
    deleteProject,
    fetchProjectById,
    fetchProjects,
    updateProject,
    type CreateProjectInput,
    type UpdateProjectInput,
} from "@/front/lib/api/projects"
import { Project } from "@/front/types/project.schema"

const PROJECT_ROOT = ["projects"] as const

// ─── Query options (exportés pour le prefetch SSR) ───────────────────────────

export const projectQueries = {
    all: PROJECT_ROOT,

    lists: () =>
        queryOptions({
            queryKey: [...PROJECT_ROOT, "list"] as const,
            queryFn: fetchProjects,
            staleTime: 1000 * 60 * 5,
        }),

    detail: (id: string) =>
        queryOptions({
            queryKey: [...PROJECT_ROOT, "detail", id] as const,
            queryFn: () => fetchProjectById(id),
            staleTime: 1000 * 60 * 5,
        }),
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useProjects = () => useQuery(projectQueries.lists())

export const useProjectById = (id: string) => useQuery(projectQueries.detail(id))

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useCreateProject = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createProject,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [...PROJECT_ROOT, "list"] }),
    })
}

export const useUpdateProject = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
            updateProject(id, data),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: PROJECT_ROOT })
        },
    })
}

export const useDeleteProject = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteProject,
        onMutate: async (projectId: string) => {
            const listKey = projectQueries.lists().queryKey
            await queryClient.cancelQueries({ queryKey: listKey })
            const previousProjects = queryClient.getQueryData<Project[]>(listKey)
            queryClient.setQueryData<Project[]>(listKey, (old = []) =>
                old.filter((project) => project.id !== projectId)
            )
            return { previousProjects }
        },
        onError: (
            _err: unknown,
            _projectId: string,
            context: { previousProjects: Project[] | undefined } | undefined
        ) => {
            if (context?.previousProjects !== undefined) {
                queryClient.setQueryData(projectQueries.lists().queryKey, context.previousProjects)
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: [...PROJECT_ROOT, "list"] }),
    })
}
