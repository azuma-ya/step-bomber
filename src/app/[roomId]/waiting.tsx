"use client";

import { ClipboardCopy } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Room } from "@/features/room/types/room";
import type { User } from "@/features/user/types/user";

interface Props {
  room: Room;
  user: User;
  onStart: () => void;
  isPending: boolean;
}

const Waiting = ({ room, user, onStart, isPending }: Props) => {
  const players = Object.values(room.players ?? {});

  return (
    <Container maxWidth="md" className="space-y-8">
      <div className="flex items-center justify-between gap-2">
        <Input readOnly value={window?.location.href} className="mt-1 block" />
        <Button
          size="icon"
          variant="outline"
          onClick={async () => {
            await navigator.clipboard.writeText(window?.location.href);
          }}
        >
          <ClipboardCopy className="size-5" />
        </Button>
      </div>
      <ul className="flex gap-2">
        {players.map((player) => (
          <li key={player.id}>
            <Avatar className="size-16">
              <AvatarImage src={player.image} />
              <AvatarFallback>
                {player.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </li>
        ))}
      </ul>
      <Button
        className="ms-auto block"
        onClick={onStart}
        disabled={isPending || players.length < 2 || room.host !== user.id}
      >
        Start
      </Button>
    </Container>
  );
};

export default Waiting;
