"use client";

import { useEffect } from "react";

import { getPlayerID } from "@/types/player";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import type { GameState } from ".";
import { Explosion } from "./actor/explosion";
import { getPiece } from "./piece";

interface Props extends BoardProps<GameState> {}

export const Board = ({ G, ctx, moves, events }: Props) => {
  const fire = G.board.fire;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          moves.move("up");
          break;
        case "ArrowRight":
          moves.move("right");
          break;
        case "ArrowDown":
          moves.move("down");
          break;
        case "ArrowLeft":
          moves.move("left");
          break;
        case "Enter":
          events.endTurn?.();
          break;
        case " ":
          moves.placeBomb(
            G.board.players[getPlayerID(ctx.currentPlayer)]!.position,
          );
          break;
      }
    };

    addEventListener("keydown", onKeyDown);

    return () => {
      removeEventListener("keydown", onKeyDown);
    };
  }, [G, ctx, moves, events]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full aspect-square">
        <table className="size-full">
          <tbody className="size-full">
            {G.board.cells.map((row, i) => (
              <tr key={i} className="w-full">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="aspect-square p-0 border border-background relative"
                    style={{
                      backgroundColor: cell,
                    }}
                  >
                    {getPiece(G, { row: i, col: j }) && (
                      <div
                        className="absolute inset-[20%] rounded-full shadow-[-2px_2px_4px_0px_rgba(0,_0,_0,_0.2)] z-10"
                        style={{
                          backgroundColor: getPiece(G, { row: i, col: j })
                            ?.color,
                        }}
                      />
                    )}
                    {fire && (fire.row === i || fire.col === j) && (
                      <div className="absolute z-50 -inset-[20%]">
                        <Explosion />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
