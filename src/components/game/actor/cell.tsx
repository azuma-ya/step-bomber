import type { GameState } from "@/game";
import { getPiece } from "@/game/piece";
import type { PlayerID } from "@/types/player";
import { Explosion } from "./explosion";

interface Props {
  G: GameState;
  i: number;
  j: number;
  cell: string;
  isFire?: boolean;
  playerID: PlayerID;
}

export const Cell = ({ G, i, j, cell, isFire = false, playerID }: Props) => {
  const bombs = G.players[playerID]?.bombs || [];
  const isBombed = bombs.find(
    (bomb) => bomb.position.row === i && bomb.position.col === j,
  );
  console.log("🚀 ~ Cell ~  G.config.isVisibleBombs:", G.config.isVisibleBombs);

  return (
    <td
      className="aspect-square p-0 border border-background relative"
      style={{
        backgroundColor: cell,
      }}
    >
      {isBombed && G.config.isVisibleBombs && (
        <div className="absolute inset-[15%] bg-white rounded-xs overflow-hidden shadow-[-3px_3px_4px_0px_rgba(0,_0,_0,_0.2)] z-10">
          <div className="absolute inset-x-0 top-0 h-2/7 bg-orange-600 before:content-[''] before:absolute before:inset-y-0 before:w-1/3 before:left-1/2 before:border-x-4 before:border-orange-800 before:-translate-x-1/2" />
          <p className="absolute z-10 inset-x-0 top-1/2 -translate-y-1/2 text-center text-black font-bold text-xl md:font-extrabold">
            TNT
          </p>
          <div className="absolute inset-x-0 bottom-0 h-2/7 bg-orange-600 before:content-[''] before:absolute before:inset-y-0 before:w-1/3 before:left-1/2 before:border-x-4 before:border-orange-800 before:-translate-x-1/2" />
        </div>
      )}
      {getPiece(G, { row: i, col: j }) && (
        <div
          className="absolute inset-[20%] rounded-full shadow-[-3px_3px_4px_0px_rgba(0,_0,_0,_0.2)] z-10"
          style={{
            backgroundColor: getPiece(G, { row: i, col: j })?.color,
          }}
        />
      )}
      {isFire && (
        <div className="absolute z-50 -inset-[20%]">
          <Explosion />
        </div>
      )}
    </td>
  );
};
