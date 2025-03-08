"use client";

import { useTransition } from "react";

import { ref, update } from "firebase/database";
import { ClipboardCopy, QrCodeIcon, Settings } from "lucide-react";

import QRCode from "@/components/base/qr-code";
import { ModeModalButton } from "@/components/modal/mode-modal";
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
import { db } from "@/lib/firebase";
import type { Config, Room } from "@/types/room";

interface Props {
  room: Room;
  onStart: () => void;
  isPending: boolean;
}

const WaitingPage = ({ room, onStart, isPending }: Props) => {
  const players = Object.values(room.players ?? {});
  const user = useData((state) => state.user);
  const [isPendingConfig, startTransition] = useTransition();

  const url = window?.location.href;

  const handleChengeConfig = (config: Config) => {
    startTransition(async () => {
      await update(ref(db, `rooms/${room.id}/config`), config);
    });
  };

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
      <div className="flex items-center gap-2 justify-end">
        <Button
          className="px-16"
          onClick={onStart}
          disabled={
            isPending ||
            isPendingConfig ||
            players.length < 2 ||
            room.host !== user?.id
          }
        >
          Start
        </Button>
        <ModeModalButton
          disabled={isPendingConfig || room.host !== user?.id}
          variant="outline"
          size="icon"
          text="変更する"
          initialConfig={room.config}
          onCreateRoom={handleChengeConfig}
        >
          <Settings />
        </ModeModalButton>
      </div>
    </div>
  );
};

export default WaitingPage;
