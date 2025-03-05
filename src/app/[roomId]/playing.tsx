"use client";

import type { JSX } from "react";

import { P2P } from "@boardgame.io/p2p";
import { Client } from "boardgame.io/react";

import { Container } from "@/components/layout/container";
import type { Room } from "@/features/room/types/room";
import type { User } from "@/features/user/types/user";
import { Game } from "@/game";
import { Board } from "@/game/board";

interface Props {
  room: Room;
  user: User;
}

const Playing = ({ room, user }: Props) => {
  const GameView = Client({
    game: Game,
    board: Board,
    multiplayer: P2P({ isHost: room.host === user.id }),
  }) as unknown as JSX.ElementType;

  return (
    <Container
      maxWidth="md"
      className="flex items-center justify-center h-[calc(100vh-var(--header-height)-var(--footer-height))]"
    >
      <GameView
        matchID={room.id}
        playerID={room.players?.[user.id]?.number.toString()}
      />
    </Container>
  );
};

export default Playing;
