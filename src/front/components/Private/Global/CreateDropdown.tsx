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
import { useUser } from "@/front/states/contexts/user.context"
import { FileText, FolderKanban, Link2, Plus, Tag, NotebookText } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { CreateCategoryForm } from "./CreateCategoryForm"
import { CreatePostForm } from "./CreatePostForm"
import { CreateProjectForm } from "./CreateProjectForm"
import { CreateResourceForm } from "./CreateResourceForm"
import { DraftsTab, DraftCount, type EditDraft } from "./DraftsTab"

type CreateType = "post" | "project" | "category" | "resource" | "drafts"

const CREATE_ITEMS = [
    { value: "post" as const, icon: FileText, label: "Post", description: "Texte, image, vidéo ou audio", supportsDraft: true },
    { value: "project" as const, icon: FolderKanban, label: "Projet", description: "Chercher des collaborateurs", supportsDraft: true },
    { value: "category" as const, icon: Tag, label: "Communauté", description: "Créer un espace thématique", supportsDraft: false },
    { value: "resource" as const, icon: Link2, label: "Ressource", description: "Asset, tutoriel ou lien", supportsDraft: false },
]

// ─── Main component ────────────────────────────────────────────────────────────

export function CreateDropdown() {
    const user = useUser()
    const [modalOpen, setModalOpen] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [activeType, setActiveType] = useState<CreateType>("post")
    const [editingDraft, setEditingDraft] = useState<EditDraft | null>(null)

    function handleSelect(type: CreateType) {
        if (!user) { setAuthModalOpen(true); return }
        setEditingDraft(null)
        setActiveType(type)
        setTimeout(() => setModalOpen(true), 0)
    }

    function handleEdit(draft: EditDraft) {
        setEditingDraft(draft)
        setActiveType(draft.type)
    }

    function handleModalClose() {
        setModalOpen(false)
        setEditingDraft(null)
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
                        <span className="hidden sm:inline text-white">Créer</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="min-w-48">
                    <DropdownMenuGroup>
                        {CREATE_ITEMS.map(({ value, icon: Icon }) => (
                            <DropdownMenuItem key={value} className="cursor-pointer" onClick={() => handleSelect(value)}>
                                <Icon className="size-4" />
                                {value === "post" ? "Créer un post"
                                    : value === "project" ? "Créer un projet"
                                        : value === "category" ? "Créer une communauté"
                                            : "Créer une ressource"}
                            </DropdownMenuItem>
                        ))}
                        {user && (
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleSelect("drafts")}>
                                <NotebookText className="size-4" />
                                Mes brouillons
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal de création */}
            <Dialog open={modalOpen} onOpenChange={handleModalClose}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent
                        className={cn(
                            "p-0 gap-0",
                            "w-full max-w-[820px] h-[90vh] sm:h-[600px]",
                            "flex overflow-hidden rounded-xl",
                        )}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                        <DialogTitle className="sr-only">Créer du contenu</DialogTitle>
                        <DialogDescription className="sr-only">Formulaire de création de contenu</DialogDescription>

                        <Tabs
                            value={activeType}
                            onValueChange={(v) => { setActiveType(v as CreateType); setEditingDraft(null) }}
                            className="flex flex-col sm:flex-row flex-1 overflow-hidden"
                        >
                            {/* Sidebar / top bar on mobile */}
                            <TabsList
                                className={cn(
                                    "flex sm:flex-col h-auto sm:h-full w-full sm:w-52 shrink-0",
                                    "justify-start gap-0.5 rounded-none",
                                    "border-b sm:border-b-0 sm:border-r bg-muted/30 p-2 sm:p-3",
                                    "overflow-x-auto sm:overflow-x-visible",
                                )}
                            >
                                {/* Créer */}
                                <p className="hidden sm:block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-2 pt-5 pb-1.5">
                                    Créer
                                </p>
                                {CREATE_ITEMS.map(({ value, icon: Icon, label, description }) => (
                                    <TabsTrigger
                                        key={value}
                                        value={value}
                                        className="sm:w-full justify-start sm:flex-col sm:items-start px-3 py-2 sm:py-2.5 h-auto data-[state=active]:bg-background shrink-0"
                                    >
                                        <span className="flex items-center gap-2 w-full">
                                            <Icon className="size-3.5 shrink-0" />
                                            <span className="font-medium text-sm">{label}</span>
                                        </span>
                                        <span className="hidden sm:block text-[11px] text-muted-foreground font-normal mt-0.5 pl-5 text-left leading-tight w-full truncate">
                                            {description}
                                        </span>
                                    </TabsTrigger>
                                ))}

                                {/* Brouillons */}
                                <p className="hidden sm:block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-2 pt-4 pb-1.5">
                                    Gérer
                                </p>
                                <TabsTrigger
                                    value="drafts"
                                    className="sm:w-full justify-start sm:flex-col sm:items-start px-3 py-2 sm:py-2.5 h-auto data-[state=active]:bg-background shrink-0"
                                >
                                    <span className="flex items-center gap-2 w-full">
                                        <NotebookText className="size-3.5 shrink-0" />
                                        <span className="font-medium text-sm">Brouillons</span>
                                        <DraftCount />
                                    </span>
                                    <span className="hidden sm:block text-[11px] text-muted-foreground font-normal mt-0.5 pl-5 text-left leading-tight w-full truncate">
                                        Posts et projets en attente
                                    </span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Content */}
                            <TabsContent value="post" className="flex-1 overflow-hidden mt-0 flex">
                                <CreatePostForm
                                    key={editingDraft?.type === "post" ? editingDraft.data.id : "new-post"}
                                    onSuccess={handleModalClose}
                                    initialData={editingDraft?.type === "post" ? editingDraft.data : undefined}
                                    mode={editingDraft?.type === "post" ? "edit" : "create"}
                                />
                            </TabsContent>
                            <TabsContent value="project" className="flex-1 overflow-hidden mt-0 flex">
                                <CreateProjectForm
                                    key={editingDraft?.type === "project" ? editingDraft.data.id : "new-project"}
                                    onSuccess={handleModalClose}
                                    initialData={editingDraft?.type === "project" ? editingDraft.data : undefined}
                                    mode={editingDraft?.type === "project" ? "edit" : "create"}
                                />
                            </TabsContent>
                            <TabsContent value="category" className="flex-1 overflow-hidden mt-0 flex">
                                <CreateCategoryForm onSuccess={handleModalClose} />
                            </TabsContent>
                            <TabsContent value="resource" className="flex-1 overflow-hidden mt-0 flex">
                                <CreateResourceForm onSuccess={handleModalClose} />
                            </TabsContent>
                            <TabsContent value="drafts" className="flex-1 overflow-hidden mt-0 flex">
                                <DraftsTab onEdit={handleEdit} />
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
                            Vous devez vous connecter ou créer un compte pour créer du contenu.
                        </DialogDescription>
                        <div className="flex gap-3 mt-6 justify-end">
                            <Link href="/sign-up" className="flex-1">
                                <Button variant="outline" className="w-full border-neutral-600">
                                    Créer un compte
                                </Button>
                            </Link>
                            <Link href="/login" className="flex-1">
                                <Button className="w-full">Se connecter</Button>
                            </Link>
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    )
}
