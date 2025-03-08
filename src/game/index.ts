import type { Game as BoardGameIOGame } from "boardgame.io";
import { PlayerView, TurnOrder } from "boardgame.io/core";

import { shuffleArray } from "@/lib/utils";
import { PlayerID, getPlayerID } from "@/types/player";
import { type BoardState, movePlayer } from "./board";
import { type Bomb, activateBombs, checkBombFire, placeBomb } from "./bomb";

export type MoveDirection = "up" | "down" | "left" | "right";

export interface GameState {
  board: BoardState;
  players: Record<PlayerID, { bombs: Bomb[]; isPlaceable: boolean }>;
  moveCount: number;
  config: {
    gridSize: number;
    isVisibleBombs: boolean;
  };
}

export const createGame = ({
  initialState,
}: { initialState: GameState }): BoardGameIOGame<GameState> => ({
  name: "step-bommer",
  setup: () => ({ ...initialState, moveCount: 0 }),

  playerView: PlayerView.STRIP_SECRETS,

  maxPlayers: 2,
  minPlayers: 2,

  turn: {
    order: TurnOrder.CUSTOM(shuffleArray([PlayerID.BLACK, PlayerID.WHITE])),

    onBegin: ({ G, ctx }) => {
      G.moveCount = 0;
      G.players[getPlayerID(ctx.currentPlayer)].isPlaceable = true;
    },
    onEnd: ({ G }) => {
      activateBombs(G);
      checkBombFire(G);
    },
  },

  moves: {
    move: ({ G, playerID, ctx }, direction: MoveDirection) => {
      if (G.moveCount >= 5 && ctx.turn <= 2) return;
      movePlayer(G.board, getPlayerID(playerID), direction);
      checkBombFire(G);
      G.moveCount++;
    },
    placeBomb: ({ G, playerID }) => {
      placeBomb(
        G,
        getPlayerID(playerID),
        G.board.players[getPlayerID(playerID)].position,
      );
    },
  },

  endIf: ({ G }) => {
    if (G.board.fire) {
      const player0Pos = G.board.players[PlayerID.BLACK].position;
      const player1Pos = G.board.players[PlayerID.WHITE].position;

      // Check if players are in fire
      const player0InFire =
        G.board.fire!.position.row === player0Pos.row ||
        G.board.fire!.position.col === player0Pos.col;
      const player1InFire =
        G.board.fire!.position.row === player1Pos.row ||
        G.board.fire!.position.col === player1Pos.col;

      if (!player0InFire && !player1InFire) return;

      const bomb = G.board.fire!;
      const bombOwner = bomb.owner;

      // プレイヤーごとの得点を計算する関数
      const calculatePoints = (playerID: PlayerID) => {
        const isInFire =
          playerID === PlayerID.BLACK ? player0InFire : player1InFire;
        const isOpponentInFire =
          playerID === PlayerID.BLACK ? player1InFire : player0InFire;
        const isBombOwner = bombOwner === playerID;

        // 自分の爆弾の場合
        if (isBombOwner) {
          if (!isInFire && isOpponentInFire) return 5; // ベストシナリオ：相手を爆破
          if (isInFire && !isOpponentInFire) return -5; // 最悪のシナリオ：自爆
          if (isInFire && isOpponentInFire) return -4; // まずまず：両者巻き込み
        }
        // 相手の爆弾の場合
        else {
          if (!isInFire && isOpponentInFire) return 3; // 良いシナリオ：相手の自爆を観戦
          if (isInFire && !isOpponentInFire) return -3; // 悪いシナリオ：相手の爆弾に巻き込まれる
          if (isInFire && isOpponentInFire) return 1; // 引き分け：両者巻き込み
        }
        return 0;
      };

      // 両プレイヤーの得点を計算
      const blackPoints = calculatePoints(PlayerID.BLACK);
      const whitePoints = calculatePoints(PlayerID.WHITE);

      // 勝者の決定
      let winner = null;
      if (blackPoints > whitePoints) {
        winner = PlayerID.BLACK;
      } else if (whitePoints > blackPoints) {
        winner = PlayerID.WHITE;
      }

      return {
        winner,
        points: {
          [PlayerID.BLACK]: blackPoints,
          [PlayerID.WHITE]: whitePoints,
        },
      };
    }
  },
});
