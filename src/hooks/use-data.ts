import { create } from "zustand";

import type { Room } from "@/types/room";
import type { User } from "@/types/user";

type DataStore = {
  user?: User;
  rooms: Room[];
  setUser: (user: User) => void;
  setRooms: (rooms: Room[]) => void;
};

export const useData = create<DataStore>((set) => ({
  user: undefined,
  rooms: [],
  setUser: (user: User) => set({ user }),
  setRooms: (rooms: Room[]) => set({ rooms }),
}));
