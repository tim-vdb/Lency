"use client";

import Link from "next/link";
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

interface AuthPromptModalProps {
    id: string;
}

export function AuthPromptModal({ id }: AuthPromptModalProps) {
    const closeModal = useModalStore((state) => state.closeModal);

    return (
        <Dialog open={true} onOpenChange={(v) => !v && closeModal(id)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Rejoindre la communauté</DialogTitle>
                    <DialogDescription>
                        Créer un compte pour aimer, enregistrer, commenter et interagir avec
                        les publications.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/login" onClick={() => closeModal(id)}>
                            Se connecter
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/sign-up" onClick={() => closeModal(id)}>
                            Créer un compte
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
