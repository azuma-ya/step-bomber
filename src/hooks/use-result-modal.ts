import { create } from "zustand";

import { PlayerID } from "@/types/player";
import type { Result } from "@/types/room";

type ResultModalType = {
  isOpen: boolean;
  result: Result;
  onOpen: (result: Result) => void;
  onClose: () => void;
};

export const useResultModal = create<ResultModalType>((set) => ({
  isOpen: false,
  result: {
    winner: null,
    points: {
      [PlayerID.BLACK]: 0,
      [PlayerID.WHITE]: 0,
    },
  },
  onOpen: (result) => set({ isOpen: true, result }),
  onClose: () => set({ isOpen: false }),
}));
