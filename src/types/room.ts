import type { User } from "@/types/user";
import { PlayerID } from "./player";

export type Room = {
  id: string;
  host: string;
  players?: Record<string, User & { score: number; number: number }>;
  gameState: {
    status: "waiting" | "playing";
    currentPlayer: string | null;
  };
  config: Config;
};

export type Result = {
  winner: string | null;
  points: {
    [PlayerID.BLACK]: number;
    [PlayerID.WHITE]: number;
  };
};

export type Config = {
  gridSize: number;
  isVisibleBombs: boolean;
};
