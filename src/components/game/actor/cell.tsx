import type { GameState } from "@/game";
import { getPiece } from "@/game/piece";
import { Explosion } from "./explosion";

interface Props {
  G: GameState;
  i: number;
  j: number;
  cell: string;
  isFire?: boolean;
}

export const Cell = ({ G, i, j, cell, isFire = false }: Props) => {
  return (
    <td
      className="aspect-square p-0 border border-background relative"
      style={{
        backgroundColor: cell,
      }}
    >
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
