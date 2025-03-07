import type { User } from "@/types/user";
import { PlayerID } from "./player";

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

export type Result = {
  winner: string | null;
  points: {
    [PlayerID.BLACK]: number;
    [PlayerID.WHITE]: number;
  };
};
