import { Origins, Server } from "boardgame.io/server";
import { TicTacToe } from "../game/tic-tac-toe";

const server = Server({
  games: [TicTacToe],
  origins: [Origins.LOCALHOST],
});

server.run(8000);
