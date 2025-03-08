"use client";

import { startTransition, useEffect, useRef } from "react";

import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { GameConfig } from "@/config/game";
import { useData } from "@/hooks/use-data";
import { useResultModal } from "@/hooks/use-result-modal";
import { db, store } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { PlayerID, getPlayerID } from "@/types/player";
import { ref, update } from "firebase/database";
import { doc, updateDoc } from "firebase/firestore";
import type { GameState } from "../../game";
import { Cell } from "./actor/cell";

interface Props extends BoardProps<GameState> {
  playerID: PlayerID;
}

export const Board = ({ G, ctx, moves, events, playerID }: Props) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const { roomId } = useParams<{ roomId: string }>();
  const onOpen = useResultModal((state) => state.onOpen);

  const user = useData((state) => state.user);
  const rooms = useData((state) => state.rooms);
  const room = rooms.find((room) => room.id === roomId);

  const fire = G.board.fire;
  const myTurn = getPlayerID(ctx.currentPlayer) === playerID;

  useEffect(() => {
    if (ctx.gameover && user) {
      startTransition(async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        onOpen(ctx.gameover);
        await updateDoc(doc(store, "users", user.id), {
          points: ctx.gameover.points[playerID] + user.points,
        });
        await update(ref(db, `rooms/${roomId}/gameState`), {
          status: "waiting",
        });
      });
    }
  }, [ctx.gameover, user, playerID, roomId, onOpen]);

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

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch || !touchStartX.current || !touchStartY.current) return;

      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;
      const minSwipeDistance = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            moves.move("right");
          } else {
            moves.move("left");
          }
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            moves.move("down");
          } else {
            moves.move("up");
          }
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    addEventListener("keydown", onKeyDown);
    addEventListener("touchstart", handleTouchStart);
    addEventListener("touchend", handleTouchEnd);

    return () => {
      removeEventListener("keydown", onKeyDown);
      removeEventListener("touchstart", handleTouchStart);
      removeEventListener("touchend", handleTouchEnd);
    };
  }, [G, ctx, moves, events]);

  return (
    <section className="w-full h-full flex flex-col items-center justify-center p-4 gap-4">
      <hgroup className="flex items-center gap-4 bg-background/50  rounded-lg">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold">Current Turn</p>
          <div
            className={cn(
              "w-6 h-6 rounded-full shadow-[-3px_3px_4px_0px_rgba(0,_0,_0,_0.2)]",
              getPlayerID(ctx.currentPlayer) === PlayerID.BLACK &&
                "dark:border-white dark:border",
            )}
            style={{
              backgroundColor:
                G.board.players[getPlayerID(ctx.currentPlayer)]?.color,
            }}
          />
          <p className="text-base underline">
            {
              Object.values(room?.players ?? {}).find(
                (player) => player.number.toString() === ctx.currentPlayer,
              )?.name
            }
          </p>
        </div>
      </hgroup>
      <div className="w-full aspect-square touch-none">
        <table className="size-full overflow-hidden">
          <tbody className="size-full">
            {G.board.cells.map((row, i) => (
              <tr key={i} className="w-full">
                {row.map((cell, j) => (
                  <Cell
                    key={j}
                    G={G}
                    i={i}
                    j={j}
                    cell={cell}
                    isFire={
                      fire &&
                      (fire.position.row === i || fire.position.col === j)
                    }
                    playerID={playerID}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="flex flex-col md:flex-row items-center gap-4 touch-none">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={
              !myTurn || !G.players[getPlayerID(ctx.currentPlayer)].isPlaceable
            }
            onClick={() => {
              if (
                myTurn &&
                G.players[getPlayerID(ctx.currentPlayer)].isPlaceable
              ) {
                moves.placeBomb();
              }
            }}
          >
            {myTurn && G.players[getPlayerID(ctx.currentPlayer)].isPlaceable
              ? "Place a bomb"
              : "Can't place a bomb"}
          </Button>
          <Button
            size="sm"
            disabled={!myTurn}
            onClick={() => events.endTurn?.()}
            onTouchEnd={(e) => {
              e.preventDefault();
              events.endTurn?.();
            }}
          >
            Turn End
          </Button>
        </div>
        <div className="h-[2.5rem] flex items-center">
          {myTurn && ctx.turn <= 2 && (
            <p className="text-sm">
              Move count left:{" "}
              <span className="font-bold text-xl">
                {GameConfig.MAX_MOVE_COUNT - G.moveCount}
              </span>
            </p>
          )}
        </div>
      </nav>
    </section>
  );
};
