"use client";

import { RoomItem } from "@/components/room-item";
import { AnimatedList } from "@/components/ui/animated-list";
import { useData } from "@/hooks/use-data";
import Link from "next/link";

const RoomListPage = () => {
  const rooms = useData((state) => state.rooms);

  return (
    <div>
      <AnimatedList className="w-full space-y-2">
        {rooms?.filter((room) => room.gameState.status === "waiting")
          ?.length === 0 && (
          <p className="text-center my-8">部屋は作成されていません...</p>
        )}
        {rooms
          ?.filter((room) => room.gameState.status === "waiting")
          .map((room) => (
            <Link key={room.id} href={`/rooms/${room.id}`}>
              <RoomItem data={room} />
            </Link>
          ))}
      </AnimatedList>
    </div>
  );
};

export default RoomListPage;
