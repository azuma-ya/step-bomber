"use client";

import { Button } from "@/components/ui/button";
import { useData } from "@/hooks/use-data";
import Link from "next/link";

const RoomListPage = () => {
  const rooms = useData((state) => state.rooms);

  return (
    <div>
      <ul className="w-full space-y-2">
        {rooms
          ?.filter((room) => room.gameState.status === "waiting")
          .map((room) => (
            <li key={room.id}>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/rooms/${room.id}`}>{room.id}</Link>
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RoomListPage;
