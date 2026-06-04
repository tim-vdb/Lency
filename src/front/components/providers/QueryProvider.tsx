"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import * as React from "react"

const queryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
        },
        mutations: {
            retry: false,
        },
    },
} as const;

// Singleton browser-side pour que tous les QueryClientProvider partagent le même cache
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
    if (typeof window === "undefined") {
        return new QueryClient(queryClientConfig);
    }
    if (!browserQueryClient) {
        browserQueryClient = new QueryClient(queryClientConfig);
    }
    return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(() => getQueryClient());

    return (
        <NuqsAdapter>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </NuqsAdapter>
    );
}
