"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PlayerID } from "@/types/player";
import type { Room } from "@/types/room";

interface Props {
  gameover: {
    winner: PlayerID | null;
    points: Record<PlayerID, number>;
  };
  room: Room;
  onRestart?: () => void;
}

export const Result = ({ gameover, room, onRestart }: Props) => {
  return (
    <Card className="w-2xl">
      <CardHeader>
        <CardTitle>Game Over!</CardTitle>
        <CardDescription>
          {gameover.winner
            ? `Winner: ${
                Object.values(room.players ?? {}).find(
                  (p) => p.number === Number(gameover.winner),
                )?.name
              }`
            : "Draw!"}
        </CardDescription>
      </CardHeader>
      <div className="space-y-4 px-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Points:</h3>
          <div className="space-y-1">
            {Object.entries(gameover.points).map(([playerId, points]) => (
              <div key={playerId} className="flex justify-between">
                <span className="text-sm">
                  {
                    Object.values(room.players ?? {}).find(
                      (p) => p.number === Number(playerId),
                    )?.name
                  }
                </span>
                <span className="text-sm font-medium">{points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {onRestart && (
        <CardFooter>
          <Button onClick={onRestart} className="w-full">
            Play Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
