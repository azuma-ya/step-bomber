import { getPlayerID } from "@/types/player";
import type { Position } from "@/types/position";
import type { Game as BoardGameIOGame } from "boardgame.io";
import { type BoardState, createBoard, movePlayer } from "./board-manager";
import { activateBombs, checkBombFire, placeBomb } from "./bomb";

export type MoveDirection = "up" | "down" | "left" | "right";

export interface GameState {
  board: BoardState;
}

export const Game: BoardGameIOGame<GameState> = {
  name: "step-bommer",
  setup: () => ({ board: createBoard(9, 630 / 9) }),

  maxPlayers: 2,
  minPlayers: 2,

  turn: {
    onBegin: ({ G }) => {
      G.board.isPlaceable = true;
    },
    onEnd: ({ G }) => {
      activateBombs(G.board);
    },
  },

  moves: {
    move: ({ G, playerID }, direction: MoveDirection) => {
      movePlayer(G.board, getPlayerID(playerID), direction);
      checkBombFire(G.board);
    },
    placeBomb: ({ G, playerID }, position: Position) => {
      placeBomb(G.board, getPlayerID(playerID), position);
    },
  },
};
