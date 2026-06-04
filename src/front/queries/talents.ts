import { fetchTalents } from "@/front/lib/api/talents";
import { queryOptions, useQuery } from "@tanstack/react-query";

const TALENT_ROOT = ["talents"] as const;

export const talentQueries = {
    lists: () =>
        queryOptions({
            queryKey: [...TALENT_ROOT, "list"],
            queryFn: fetchTalents,
            staleTime: 1000 * 60 * 5,
        }),
};

export const useTalents = () => useQuery(talentQueries.lists());
