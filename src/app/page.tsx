"use client";

import { SocketIO } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";

import { Board } from "@/components/tic-tac-toe-board";
import { TicTacToe } from "@/game/tic-tac-toe";
import type { JSX } from "react";

const TicTacToeClient = Client({
  game: TicTacToe,
  board: Board,
  multiplayer: SocketIO({ server: "localhost:8000" }),
}) as unknown as JSX.ElementType;

const App = () => (
  <main className="h-screen flex items-center justify-center gap-4">
    <TicTacToeClient playerID="0" />
    <TicTacToeClient playerID="1" />
  </main>
);

export default App;
