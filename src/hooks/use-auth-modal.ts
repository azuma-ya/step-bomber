import { create } from "zustand";

type AuthModalType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAuthModal = create<AuthModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
