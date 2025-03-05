import type { Position } from "@/types/position";
import type { PlayerID } from "boardgame.io";
import type { GameState } from ".";

export type Piece = {
  color: string;
  position: Position;
  playerID: PlayerID;
};

export const getPiece = (G: GameState, position: Position): Piece | null => {
  // プレイヤーの位置をチェック
  for (const [playerID, player] of Object.entries(G.board.players)) {
    if (
      player.position.row === position.row &&
      player.position.col === position.col
    ) {
      return {
        color: player.color,
        position: player.position,
        playerID: playerID as PlayerID,
      };
    }
  }

  // 駒が見つからなかった場合
  return null;
};
