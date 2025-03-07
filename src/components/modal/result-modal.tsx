"use client";

import { useData } from "@/hooks/use-data";
import { useResultModal } from "@/hooks/use-result-modal";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const ResultModal = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { isOpen, result, onClose } = useResultModal();
  const rooms = useData((state) => state.rooms);
  const room = rooms.find((room) => room.id === roomId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Result</DialogTitle>
          <DialogDescription>
            {result.winner
              ? `Winner: ${
                  Object.values(room?.players ?? {}).find(
                    (p) => p.number === Number(result.winner),
                  )?.name
                }`
              : "Draw!"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Points:</h3>
          <div className="space-y-1">
            {Object.entries(result.points).map(([playerId, points]) => (
              <div key={playerId} className="flex justify-between">
                <span className="text-sm">
                  {
                    Object.values(room?.players ?? {}).find(
                      (p) => p.number === Number(playerId),
                    )?.name
                  }
                </span>
                <span className="text-sm font-medium">{points}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
