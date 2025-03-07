"use client";

import { ClipboardCopy, QrCodeIcon } from "lucide-react";

import QRCode from "@/components/base/qr-code";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useData } from "@/hooks/use-data";
import type { Room } from "@/types/room";

interface Props {
  room: Room;
  onStart: () => void;
  isPending: boolean;
}

const Waiting = ({ room, onStart, isPending }: Props) => {
  const players = Object.values(room.players ?? {});
  const user = useData((state) => state.user);

  const url = window?.location.href;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-2 mt-1">
        <Input readOnly value={url} className="block" />
        <Button
          size="icon"
          variant="outline"
          onClick={async () => {
            await navigator.clipboard.writeText(window?.location.href);
          }}
        >
          <ClipboardCopy className="size-5" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline">
              <QrCodeIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code</DialogTitle>
              <DialogDescription>{url}</DialogDescription>
            </DialogHeader>
            <div className="mx-auto">
              <QRCode url={url} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="flex gap-4">
        {players.map((player) => (
          <li key={player.id}>
            <Avatar className="size-16">
              <AvatarImage src={player.image} />
              <AvatarFallback>
                {player.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-center">{player.name}</p>
          </li>
        ))}
      </ul>
      <Button
        className="ms-auto block"
        onClick={onStart}
        disabled={isPending || players.length < 2 || room.host !== user?.id}
      >
        Start
      </Button>
    </div>
  );
};

export default Waiting;
