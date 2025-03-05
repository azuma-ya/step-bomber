import type { Position } from "./position";

export enum PlayerID {
  BLACK = "0",
  WHITE = "1",
}

export enum PlayerTurn {
  BLACK = "0",
  WHITE = "1",
}

export type Player = {
  id: PlayerID;
  color: string;
  position: Position;
};

export const getOpponentPlayerID = (playerID: PlayerID): PlayerID => {
  return playerID === PlayerID.BLACK ? PlayerID.WHITE : PlayerID.BLACK;
};

export const getPlayerID = (turn: string): PlayerID => {
  return turn as "0" | "1" as PlayerID;
};
