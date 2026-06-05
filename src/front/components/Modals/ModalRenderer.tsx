"use client";

import { useModalStore } from "@/front/states/stores/modal.store";
import { AuthPromptModal } from "./AuthPromptModal";
import { ConfirmModal } from "./ConfirmModal";
import { AlertModal } from "./AlertModal";

export function ModalRenderer() {
    const modals = useModalStore((state) => state.modals);

    return (
        <>
            {modals.map((modal) => {
                switch (modal.type) {
                    case "authPrompt":
                        return <AuthPromptModal key={modal.id} id={modal.id} />;
                    case "confirm":
                        return (
                            <ConfirmModal
                                key={modal.id}
                                id={modal.id}
                                {...(modal.props)}
                            />
                        );
                    case "alert":
                        return (
                            <AlertModal
                                key={modal.id}
                                id={modal.id}
                                {...(modal.props)}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
}
