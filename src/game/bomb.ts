import {
  type PlayerID,
  getOpponentPlayerID,
  getPlayerID,
} from "@/types/player";
import type { Position } from "@/types/position";
import type { BoardState } from "./board-manager";

export type Bomb = {
  position: Position;
  isActivated: boolean;
  owner: PlayerID;
};

export const placeBomb = (
  board: BoardState,
  playerID: PlayerID,
  position: Position,
) => {
  if (!board.isPlaceable) return;
  board.bombs.push({
    position,
    isActivated: false,
    owner: playerID,
  });
  board.isPlaceable = false;
};

export const activateBombs = (board: BoardState) => {
  for (const bomb of board.bombs) {
    if (!bomb.isActivated) bomb.isActivated = true;
  }
};

export const checkBombFire = (board: BoardState) => {
  const activatedBombs = board.bombs.filter((bomb) => bomb.isActivated);
  if (activatedBombs.length === 0) return;

  // 各プレイヤーの位置をチェック
  for (const [playerID, player] of Object.entries(board.players)) {
    // 各爆弾について爆発範囲をチェック
    for (const bomb of activatedBombs) {
      const { row: bombRow, col: bombCol } = bomb.position;
      const { row: playerRow, col: playerCol } = player.position;

      // 同じ位置にいるかチェック
      if (bombRow === playerRow && bombCol === playerCol) {
        console.log(`Player ${playerID} was hit by a bomb! (Direct hit)`);
        board.fire = bomb.position;

        // 十字方向のチェック - 同じ行または列
        const opponentID = getOpponentPlayerID(getPlayerID(playerID));
        const { row: opponentRow, col: opponentCol } =
          board.players[opponentID]!.position;
        if (bombRow === opponentRow || bombCol === opponentCol) {
          console.log(
            `Player ${opponentID} was hit by a bomb! (Cross explosion)`,
          );
        }
      }
    }
  }
};
