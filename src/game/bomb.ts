import {
  type PlayerID,
  getOpponentPlayerID,
  getPlayerID,
} from "@/types/player";
import type { Position } from "@/types/position";
import type { GameState } from ".";

export type Bomb = {
  position: Position;
  isActivated: boolean;
  owner: PlayerID;
};

export const placeBomb = (
  G: GameState,
  playerID: PlayerID,
  position: Position,
) => {
  if (!G.players[playerID].isPlaceable) return;
  G.players[playerID].bombs.push({
    position,
    isActivated: false,
    owner: playerID,
  });
  G.players[playerID].isPlaceable = false;
};

export const activateBombs = (G: GameState) => {
  for (const bomb of Object.values(G.players).flatMap((player) => player.bombs))
    bomb.isActivated = true;
};

export const checkBombFire = (G: GameState) => {
  const activatedBombs = Object.values(G.players).flatMap((player) =>
    player.bombs.filter((bomb) => bomb.isActivated),
  );
  if (activatedBombs.length === 0) return;

  // 各プレイヤーの位置をチェック
  for (const [playerID, player] of Object.entries(G.board.players)) {
    // 各爆弾について爆発範囲をチェック
    for (const bomb of activatedBombs) {
      const { row: bombRow, col: bombCol } = bomb.position;
      const { row: playerRow, col: playerCol } = player.position;

      // 同じ位置にいるかチェック
      if (bombRow === playerRow && bombCol === playerCol) {
        console.log(`Player ${playerID} was hit by a bomb! (Direct hit)`);
        G.board.fire = bomb;

        // 十字方向のチェック - 同じ行または列
        const opponentID = getOpponentPlayerID(getPlayerID(playerID));
        const { row: opponentRow, col: opponentCol } =
          G.board.players[opponentID]!.position;
        if (bombRow === opponentRow || bombCol === opponentCol) {
          console.log(
            `Player ${opponentID} was hit by a bomb! (Cross explosion)`,
          );
        }
      }
    }
  }
};
