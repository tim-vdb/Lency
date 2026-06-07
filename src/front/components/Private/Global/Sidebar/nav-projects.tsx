"use client"

import { useState } from "react"
import { Folder, MoreHorizontal, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/front/components/ui/alert-dialog"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/front/components/ui/sidebar"
import { useMyProjects, useDeleteProject } from "@/front/queries/projects"
import { useUser } from "@/front/states/contexts/user.context"
import NotebookPen from "@/front/components/ui/notebook-pen-icon"
import { Skeleton } from "@/front/components/ui/skeleton"
import { toast } from "sonner"

export function NavProjects() {
  const { isMobile } = useSidebar()
  const user = useUser()
  const { data: projects = [], isLoading } = useMyProjects()
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject()
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Projets</SidebarGroupLabel>
        <SidebarMenu>
          {[1, 2].map((i) => (
            <SidebarMenuItem key={i}>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  if (projects.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projets</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.id}>
            <SidebarMenuButton asChild tooltip={project.title}>
              <Link href={`/marketplace/${project.id}`}>
                <NotebookPen className="shrink-0" />
                <span className="truncate">{project.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal className="cursor-pointer" />
                  <span className="sr-only">Plus</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem asChild>
                  <Link href={`/marketplace/${project.id}`} className="cursor-pointer">
                    <Folder className="text-muted-foreground" />
                    <span>Voir le projet</span>
                  </Link>
                </DropdownMenuItem>
                {project.ownerId === user?.id && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => setProjectToDelete(project.id)}
                    >
                      <Trash2 className="text-muted-foreground" />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le projet ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le projet et toutes ses données seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={() => {
                if (!projectToDelete) return
                deleteProject(projectToDelete, {
                  onSuccess: () => {
                    toast.success("Projet supprimé")
                    setProjectToDelete(null)
                  },
                  onError: () => toast.error("Erreur lors de la suppression"),
                })
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarGroup>
  )
}
