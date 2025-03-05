import type { User } from "@/features/user/types/user";

export type Room = {
  id: string;
  host: string;
  createdAt: Date;
  players?: Record<string, User & { score: number; number: number }>;
  gameState: {
    status: "waiting" | "playing";
    currentPlayer: string | null;
  };
};
