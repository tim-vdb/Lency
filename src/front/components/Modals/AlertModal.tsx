"use client";

import { useModalStore } from "@/front/states/stores/modal.store";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

interface AlertModalProps {
    id: string;
    title?: string;
    description?: string;
    buttonText?: string;
}

export function AlertModal({
    id,
    title = "Alerte",
    description,
    buttonText = "Fermer",
}: AlertModalProps) {
    const closeModal = useModalStore((state) => state.closeModal);

    return (
        <Dialog open={true} onOpenChange={(v) => !v && closeModal(id)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => closeModal(id)}>{buttonText}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
