"use client";

import { RoomItem } from "@/components/room-item";
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
              <Link href={`/rooms/${room.id}`}>
                <RoomItem data={room} />
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RoomListPage;
