import type { TicTacToeState } from "@/game/tic-tac-toe";
import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";

const getWinner = (ctx: Ctx): string | null => {
  if (!ctx.gameover) return null;
  if (ctx.gameover.draw) return "Draw";
  return `Player ${ctx.gameover.winner} wins!`;
};

interface TicTacToeProps extends BoardProps<TicTacToeState> {}

export const Board = ({ G, ctx, moves }: TicTacToeProps) => {
  const winner = getWinner(ctx);

  return (
    <main className="flex flex-col items-center justify-center">
      <div
        style={{
          display: "grid",
          gridTemplate: "repeat(3, 3rem) / repeat(3, 3rem)",
          gridGap: "0.3em",
        }}
      >
        {G.cells.map((cell, index) => (
          <button
            type="button"
            key={index}
            onClick={() => moves.clickCell(index)}
            disabled={cell !== null}
            className="border border-black"
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && <p>{winner}</p>}
    </main>
  );
};
