"use client"

import { Button } from "@/front/components/ui/button"
import {
    Dialog,
    DialogContent,
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
import { Input } from "@/front/components/ui/input"
import { Label } from "@/front/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs"
import { Textarea } from "@/front/components/ui/textarea"
import { cn } from "@/front/lib/utils"
import { FileText, FolderKanban, Plus, Tag } from "lucide-react"
import { useState } from "react"
import { CreateCategoryForm } from "./CreateCategoryForm"
import { CreatePostForm } from "./CreatePostForm"

type CreateType = "post" | "project" | "category"

// ─── Placeholder form (project) ───────────────────────────────────────────────

function CreateProjectForm() {
    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="text-lg font-semibold">Créer un projet</h2>
                <p className="text-sm text-muted-foreground">
                    Présentez votre projet à la communauté.
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="project-title">Titre</Label>
                    <Input id="project-title" placeholder="Nom de votre projet…" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                        id="project-description"
                        placeholder="Décrivez votre projet…"
                        className="min-h-36 resize-none"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="project-link">Lien (optionnel)</Label>
                    <Input id="project-link" type="url" placeholder="https://…" />
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <Button>Créer le projet</Button>
            </div>
        </div>
    )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function CreateDropdown() {
    const [modalOpen, setModalOpen] = useState(false)
    const [activeType, setActiveType] = useState<CreateType>("post")

    function handleSelect(type: CreateType) {
        setActiveType(type)
        setModalOpen(true)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="ml-auto shadow-lg-base cursor-pointer border-neutral-300"
                    >
                        <span>Créer</span>
                        <Plus className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="min-w-44">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleSelect("post")}>
                            <FileText className="size-4" />
                            Créer un post
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSelect("project")}>
                            <FolderKanban className="size-4" />
                            Créer un projet
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSelect("category")}>
                            <Tag className="size-4" />
                            Créer une catégorie
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
                            "w-full max-w-2xl h-[560px]",
                            "flex overflow-hidden rounded-xl",
                        )}
                    >
                        <DialogTitle className="sr-only">Créer du contenu</DialogTitle>

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
                            </TabsList>

                            {/* Content */}
                            <TabsContent
                                value="post"
                                className="flex-1 overflow-y-auto p-6 mt-0"
                            >
                                <CreatePostForm onSuccess={() => setModalOpen(false)} />
                            </TabsContent>
                            <TabsContent
                                value="project"
                                className="flex-1 overflow-y-auto p-6 mt-0"
                            >
                                <CreateProjectForm />
                            </TabsContent>
                            <TabsContent
                                value="category"
                                className="flex-1 overflow-y-auto p-6 mt-0"
                            >
                                <CreateCategoryForm onSuccess={() => setModalOpen(false)} />
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    )
}
