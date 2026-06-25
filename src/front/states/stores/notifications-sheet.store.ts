import { create } from "zustand";

interface NotificationsSheetStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useNotificationsSheetStore = create<NotificationsSheetStore>()((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));
