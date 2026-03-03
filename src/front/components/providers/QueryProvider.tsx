"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import * as React from "react"

/**
 * Provider React Query pour toute l'application
 * 
 * Ce composant wrap l'application avec QueryClientProvider pour:
 * - Gérer le cache des requêtes HTTP
 * - Synchroniser les données entre composants
 * - Gérer automatiquement le loading/error states
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
    // useState pour éviter de recréer le QueryClient à chaque render
    // C'est important pour Next.js qui peut re-render le provider
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Combien de temps garder les données en cache (5 minutes)
                        staleTime: 1000 * 60 * 5,
                        // Ne pas refetch automatiquement au focus de la fenêtre
                        refetchOnWindowFocus: false,
                        // Retry 1 fois en cas d'erreur
                        retry: 1,
                    },
                    mutations: {
                        // Ne pas retry les mutations (POST/PUT/DELETE) en cas d'erreur
                        retry: false,
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* DevTools pour débugger (n'apparaît qu'en dev) */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
