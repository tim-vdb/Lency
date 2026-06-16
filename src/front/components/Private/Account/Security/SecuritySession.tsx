"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/fr"
import { Loader2, LogOut, Monitor, Smartphone } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/front/components/ui/badge"
import { Button } from "@/front/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card"
import { Separator } from "@/front/components/ui/separator"
import { authClient, useSession } from "@/back/lib/auth-client"

dayjs.extend(relativeTime)
dayjs.locale("fr")

function parseUserAgent(ua: string | null | undefined): { label: string; isMobile: boolean } {
    if (!ua) return { label: "Appareil inconnu", isMobile: false }

    const isMobile = /mobile|android|iphone|ipad/i.test(ua)

    let browser = "Navigateur"
    if (/edg/i.test(ua)) browser = "Edge"
    else if (/chrome/i.test(ua)) browser = "Chrome"
    else if (/firefox/i.test(ua)) browser = "Firefox"
    else if (/safari/i.test(ua)) browser = "Safari"

    let os = ""
    if (/iphone/i.test(ua)) os = "iPhone"
    else if (/ipad/i.test(ua)) os = "iPad"
    else if (/android/i.test(ua)) os = "Android"
    else if (/windows/i.test(ua)) os = "Windows"
    else if (/mac os x/i.test(ua)) os = "macOS"
    else if (/linux/i.test(ua)) os = "Linux"

    return { label: os ? `${browser} sur ${os}` : browser, isMobile }
}

export default function SecuritySession() {
    const queryClient = useQueryClient()
    const { data: sessionData } = useSession()
    const currentToken = sessionData?.session?.token

    const { data: sessions = [], isLoading } = useQuery({
        queryKey: ["sessions", "list"],
        queryFn: async () => {
            const result = await authClient.listSessions()
            return result.data ?? []
        },
    })

    const { mutate: revokeOne, isPending: isRevoking } = useMutation({
        mutationFn: (token: string) => authClient.revokeSession({ token }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] })
            toast.success("Session déconnectée.")
        },
        onError: () => toast.error("Une erreur est survenue."),
    })

    const { mutate: revokeOthers, isPending: isRevokingOthers } = useMutation({
        mutationFn: () => authClient.revokeOtherSessions(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] })
            toast.success("Toutes les autres sessions ont été déconnectées.")
        },
        onError: () => toast.error("Une erreur est survenue."),
    })

    const otherSessions = sessions.filter((s) => s.token !== currentToken)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sessions actives</CardTitle>
                <CardDescription>
                    Gérez vos appareils connectés et déconnectez les sessions suspectes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        <div className="flex justify-center py-6">
                            <Loader2 className="size-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Aucune session active trouvée.
                        </p>
                    ) : (
                        sessions.map((session, index) => {
                            const { label, isMobile } = parseUserAgent(session.userAgent)
                            const isCurrent = session.token === currentToken

                            return (
                                <div key={session.id}>
                                    {index > 0 && <Separator className="mb-4" />}
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            {isMobile ? (
                                                <Smartphone className="size-5 shrink-0 text-muted-foreground" />
                                            ) : (
                                                <Monitor className="size-5 shrink-0 text-muted-foreground" />
                                            )}
                                            <div>
                                                <p className="font-medium text-sm">{label}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {session.ipAddress ?? "IP inconnue"} ·{" "}
                                                    {isCurrent ? "Actif maintenant" : dayjs(session.updatedAt).fromNow()}
                                                </p>
                                            </div>
                                        </div>
                                        {isCurrent ? (
                                            <Badge variant="secondary">Actuelle</Badge>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={isRevoking}
                                                onClick={() => revokeOne(session.token)}
                                            >
                                                {isRevoking ? (
                                                    <Loader2 className="size-4 animate-spin" />
                                                ) : (
                                                    <LogOut className="size-4" />
                                                )}
                                                Déconnecter
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}

                    {otherSessions.length > 0 && (
                        <>
                            <Separator />
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled={isRevokingOthers}
                                onClick={() => revokeOthers()}
                            >
                                {isRevokingOthers && <Loader2 className="size-4 animate-spin" />}
                                Déconnecter toutes les autres sessions
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
