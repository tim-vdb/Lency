"use client"

import { Button } from "@/front/components/ui/button"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/front/components/ui/alert-dialog"

interface AdminConfirmDeleteProps {
    open: boolean
    onClose: () => void
    label?: string
    onConfirm: () => void
    isPending?: boolean
}

export function AdminConfirmDelete({
    open,
    onClose,
    label = "cet élément",
    onConfirm,
    isPending,
}: AdminConfirmDeleteProps) {
    return (
        <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                    <AlertDialogDescription>
                        Supprimer {label} ? Cette action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
                    <Button
                        onClick={() => { onConfirm(); onClose() }}
                        disabled={isPending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {isPending ? "Suppression..." : "Supprimer"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
