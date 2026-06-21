"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/front/components/ui/tabs"
import { Button } from "@/front/components/ui/button"
import { Badge } from "@/front/components/ui/badge"
import { EmailsList } from "./EmailsList"
import { EmailDetail } from "./EmailDetail"
import { EmailCompose } from "./EmailCompose"
import { useUnreadCounts } from "@/front/queries/admin-emails"
import { AdminEmailBox } from "@/back/generated/prisma_client"
import { Pencil, Mail } from "lucide-react"
import { cn } from "@/front/lib/utils"

export function EmailsShell() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [activeBox, setActiveBox] = useState<AdminEmailBox>(AdminEmailBox.SUPPORT)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [composeOpen, setComposeOpen] = useState(false)
    const { data: unread } = useUnreadCounts()

    // Lire les paramètres URL au montage
    useEffect(() => {
        const box = searchParams.get("box") as AdminEmailBox | null
        const mailId = searchParams.get("mailId")

        if (box && Object.values(AdminEmailBox).includes(box)) {
            setActiveBox(box)
        }
        if (mailId) {
            setSelectedId(mailId)
        }
    }, [searchParams])

    const handleBoxChange = (box: string) => {
        setActiveBox(box as AdminEmailBox)
        setSelectedId(null)
    }

    const handleBack = () => setSelectedId(null)

    return (
        <div className="flex h-[calc(100vh-5rem)] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            {/* Sidebar */}
            <div className={cn(
                "flex flex-col border-r border-border shrink-0 transition-all duration-200",
                selectedId ? "hidden md:flex w-80" : "flex w-full md:w-80"
            )}>
                {/* Header sidebar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Mail className="size-4 text-muted-foreground" />
                        <h1 className="text-sm font-semibold">Emails</h1>
                    </div>
                    <Button
                        size="sm"
                        className="gap-2 h-8"
                        onClick={() => setComposeOpen(true)}
                    >
                        <Pencil className="size-3.5" />
                        Rédiger
                    </Button>
                </div>

                {/* Box tabs */}
                <div className="px-3 py-2 border-b border-border">
                    <Tabs value={activeBox} onValueChange={handleBoxChange}>
                        <TabsList className="w-full h-8">
                            <TabsTrigger value={AdminEmailBox.SUPPORT} className="flex-1 text-xs gap-1.5">
                                support
                                {!!unread?.support && (
                                    <Badge className="h-4 px-1 text-[10px] bg-orange text-white">
                                        {unread.support}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value={AdminEmailBox.DEV} className="flex-1 text-xs gap-1.5">
                                dev
                                {!!unread?.dev && (
                                    <Badge className="h-4 px-1 text-[10px] bg-orange text-white">
                                        {unread.dev}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Email list */}
                <div className="flex-1 overflow-y-auto">
                    <EmailsList
                        box={activeBox}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />
                </div>
            </div>

            {/* Detail panel */}
            <div className={cn(
                "flex-1 overflow-hidden",
                !selectedId && "hidden md:flex items-center justify-center"
            )}>
                {selectedId ? (
                    <EmailDetail emailId={selectedId} onBack={handleBack} />
                ) : (
                    <div className="flex flex-col items-center justify-center text-center gap-3 text-muted-foreground p-8">
                        <Mail className="size-12 opacity-20" />
                        <div>
                            <p className="text-sm font-medium">Sélectionnez un email</p>
                            <p className="text-xs opacity-60 mt-0.5">pour lire son contenu</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Compose modal */}
            <EmailCompose
                open={composeOpen}
                onClose={() => setComposeOpen(false)}
                defaultBox={activeBox}
            />
        </div>
    )
}
