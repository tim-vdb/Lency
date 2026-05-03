"use client";

import { useModalStore } from "@/front/stores/use-modal.store";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

interface ConfirmModalProps {
    id: string;
    title?: string;
    description?: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmModal({
    id,
    title = "Confirmer",
    description,
    onConfirm,
    confirmText = "Confirmer",
    cancelText = "Annuler",
}: ConfirmModalProps) {
    const closeModal = useModalStore((state) => state.closeModal);

    const handleConfirm = () => {
        onConfirm?.();
        closeModal(id);
    };

    return (
        <Dialog open={true} onOpenChange={(v) => !v && closeModal(id)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={() => closeModal(id)}>
                        {cancelText}
                    </Button>
                    <Button onClick={handleConfirm}>{confirmText}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
