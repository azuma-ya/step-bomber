import { INVALID_MOVE } from "boardgame.io/core";

import { type Player, PlayerID, getOpponentPlayerID } from "@/types/player";
import type { Position } from "@/types/position";
import type { MoveDirection } from ".";
import type { Bomb } from "./bomb";

const getMoveDiff = (direction: MoveDirection): Position => {
  switch (direction) {
    case "up":
      return { row: -1, col: 0 };
    case "down":
      return { row: 1, col: 0 };
    case "left":
      return { row: 0, col: -1 };
    case "right":
      return { row: 0, col: 1 };
    default:
      return { row: 0, col: 0 };
  }
};

export interface BoardState {
  cells: string[][];
  bombs: Bomb[];
  players: {
    [PlayerID.BLACK]: Player;
    [PlayerID.WHITE]: Player;
  };
  fire: Position | undefined;
  isPlaceable: boolean;
  gridSize: number;
  cellSize: number;
}

export const createBoard = (
  gridSize: number,
  cellSize: number,
): BoardState => ({
  cells: createCells(gridSize, [
    "#7cfc00",
    "#00ff00",
    "#adff2f",
    "#eee8aa",
    "#7cfc00",
  ]),
  bombs: [],
  players: {
    [PlayerID.BLACK]: {
      id: PlayerID.BLACK,
      color: "#000",
      position: { row: 0, col: 0 },
    },
    [PlayerID.WHITE]: {
      id: PlayerID.WHITE,
      color: "#fff",
      position: { row: gridSize - 1, col: gridSize - 1 },
    },
  },
  fire: undefined,
  isPlaceable: true,
  gridSize,
  cellSize,
});

const createCells = (
  gridSize: number,
  colors: string[] = ["#000"],
): string[][] =>
  new Array(gridSize)
    .fill(0)
    .map(() =>
      new Array(gridSize)
        .fill(0)
        .map(() => colors[Math.floor(Math.random() * colors.length)]),
    );

export const getPlayerPosition = (
  board: BoardState,
  playerID: PlayerID,
): Position => {
  return board.players[playerID].position;
};

export const movePlayer = (
  board: BoardState,
  playerID: PlayerID,
  direction: MoveDirection,
) => {
  const currentPos = board.players[playerID].position;
  const newRow = currentPos.row + getMoveDiff(direction).row;
  const newCol = currentPos.col + getMoveDiff(direction).col;

  if (
    newRow < 0 ||
    newRow >= board.gridSize ||
    newCol < 0 ||
    newCol >= board.gridSize
  ) {
    return INVALID_MOVE;
  }

  const otherPlayerPos = board.players[getOpponentPlayerID(playerID)].position;

  if (newRow === otherPlayerPos.row && newCol === otherPlayerPos.col) {
    return INVALID_MOVE;
  }

  board.players[playerID].position = { row: newRow, col: newCol };
};
