"use client"

import { Button } from "@/front/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle
} from "@/front/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs"
import { cn } from "@/front/lib/utils"
import { useUser } from "@/front/context/UserContext"
import { FileText, FolderKanban, Link2, Plus, Tag } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { CreateCategoryForm } from "./CreateCategoryForm"
import { CreatePostForm } from "./CreatePostForm"
import { CreateProjectForm } from "./CreateProjectForm"
import { CreateResourceForm } from "./CreateResourceForm"

type CreateType = "post" | "project" | "category" | "resource"

// ─── Main component ────────────────────────────────────────────────────────────

export function CreateDropdown() {
    const user = useUser()
    const [modalOpen, setModalOpen] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [activeType, setActiveType] = useState<CreateType>("post")

    function handleSelect(type: CreateType) {
        if (!user) {
            setAuthModalOpen(true)
            return
        }
        setActiveType(type)
        setModalOpen(true)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex gap-2 ml-auto cursor-pointer border-neutral-300 bg-orange hover:bg-orange/80 rounded-sm"
                    >
                        <Plus className="w-4 h-4 border border-white text-white rounded-[3px]" />
                        <span className="text-white">Créer</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="min-w-44">
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleSelect("post")}>
                            <FileText className="size-4" />
                            Créer un post
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleSelect("project")}>
                            <FolderKanban className="size-4" />
                            Créer un projet
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleSelect("category")}>
                            <Tag className="size-4" />
                            Créer une catégorie
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleSelect("resource")}>
                            <Link2 className="size-4" />
                            Créer une ressource
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent
                        className={cn(
                            "p-0 gap-0",
                            "w-full max-w-[820px] h-[600px]",
                            "flex overflow-hidden rounded-xl",
                        )}
                    >
                        <DialogTitle className="sr-only">Créer du contenu</DialogTitle>
                        <DialogDescription className="sr-only">Formulaire de création de contenu</DialogDescription>

                        {/* Tabs = sidebar gauche + contenu droite */}
                        <Tabs
                            value={activeType}
                            onValueChange={(v) => setActiveType(v as CreateType)}
                            className="flex flex-1 overflow-hidden"
                        >
                            {/* Sidebar */}
                            <TabsList
                                className={cn(
                                    "flex flex-col h-full w-44 shrink-0",
                                    "justify-start gap-1 rounded-none",
                                    "border-r bg-muted/30 p-2 pt-10",
                                )}
                            >
                                <TabsTrigger
                                    value="post"
                                    className="w-full justify-start gap-2.5"
                                >
                                    <FileText className="size-4 shrink-0" />
                                    Post
                                </TabsTrigger>
                                <TabsTrigger
                                    value="project"
                                    className="w-full justify-start gap-2.5"
                                >
                                    <FolderKanban className="size-4 shrink-0" />
                                    Projet
                                </TabsTrigger>
                                <TabsTrigger
                                    value="category"
                                    className="w-full justify-start gap-2.5"
                                >
                                    <Tag className="size-4 shrink-0" />
                                    Catégorie
                                </TabsTrigger>
                                <TabsTrigger
                                    value="resource"
                                    className="w-full justify-start gap-2.5"
                                >
                                    <Link2 className="size-4 shrink-0" />
                                    Ressource
                                </TabsTrigger>
                            </TabsList>

                            {/* Content — MultistepForm renders its own <form> + step sidebar */}
                            <TabsContent value="post" className="flex-1 overflow-hidden mt-0 flex">
                                <CreatePostForm onSuccess={() => setModalOpen(false)} />
                            </TabsContent>
                            <TabsContent value="project" className="flex-1 overflow-hidden mt-0 flex">
                                <CreateProjectForm onSuccess={() => setModalOpen(false)} />
                            </TabsContent>
                            <TabsContent value="category" className="flex-1 overflow-hidden mt-0 flex">
                                <CreateCategoryForm onSuccess={() => setModalOpen(false)} />
                            </TabsContent>
                            <TabsContent value="resource" className="flex-1 overflow-hidden mt-0 flex">
                                <CreateResourceForm onSuccess={() => setModalOpen(false)} />
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </DialogPortal>
            </Dialog>

            {/* Auth Required Modal */}
            <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent className="max-w-md">
                        <DialogTitle>Authentification requise</DialogTitle>
                        <DialogDescription>
                            Vous devez vous connecter ou créer un compte pour pouvoir créer du contenu.
                        </DialogDescription>
                        <div className="flex gap-3 mt-6 justify-end">
                            <Link href="/sign-up" className="flex-1">
                                <Button variant="outline" className="w-full border-neutral-600">
                                    Créer un compte
                                </Button>
                            </Link>
                            <Link href="/login" className="flex-1">
                                <Button className="w-full">
                                    Se connecter
                                </Button>
                            </Link>
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    )
}
