"use client";

import type { JSX } from "react";

import { P2P } from "@boardgame.io/p2p";
import { Client } from "boardgame.io/react";

import { Board } from "@/components/game/board";
import { GameConfig } from "@/config/game";
import { createGame } from "@/game";
import { createBoard } from "@/game/board";
import { useData } from "@/hooks/use-data";
import { PlayerID } from "@/types/player";
import type { Room } from "@/types/room";

interface Props {
  room: Room;
}

const PlayingPage = ({ room }: Props) => {
  const user = useData((state) => state.user);

  const GameView = Client({
    game: createGame({
      initialState: {
        board: createBoard(GameConfig),
        players: {
          [PlayerID.BLACK]: {
            bombs: [],
            isPlaceable: true,
          },
          [PlayerID.WHITE]: {
            bombs: [],
            isPlaceable: true,
          },
        },
        moveCount: 0,
      },
    }),
    board: Board,
    multiplayer: P2P({ isHost: room.host === user?.id }),
  }) as unknown as JSX.ElementType;

  return (
    <div className="flex w-full items-center justify-center h-[calc(100vh-var(--header-height)-var(--footer-height))]">
      <div className="md:w-2/3 w-full flex items-center justify-center">
        <GameView
          matchID={room.id}
          playerID={room.players?.[user?.id ?? ""]?.number.toString()}
        />
      </div>
    </div>
  );
};

export default PlayingPage;
