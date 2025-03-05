"use client";

import { ref, update } from "firebase/database";
import { useParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useObjectVal } from "react-firebase-hooks/database";

import type { Room } from "@/features/room/types/room";
import type { User } from "@/features/user/types/user";
import { auth, db, store } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Playing from "./playing";
import Waiting from "./waiting";

const RoomIdPage = () => {
  const [isPending, startTransition] = useTransition();
  const { roomId } = useParams<{ roomId: string }>();
  const [authUser] = useAuthState(auth);
  const [user] = useDocumentData(
    authUser ? doc(store, "users", authUser.uid) : null,
  );

  const [room, loading] = useObjectVal<Room>(ref(db, `rooms/${roomId}`));

  const players = Object.values(room?.players ?? {});

  const handleStart = () => {
    startTransition(async () => {
      await update(ref(db, `rooms/${roomId}/gameState`), {
        status: "playing",
        currentPlayer: players[0].id,
      });
    });
  };

  useEffect(() => {
    if (!user || !room) return;
    if (players.every((player) => player.id !== user.id)) {
      startTransition(async () => {
        await update(ref(db, `rooms/${roomId}/players/${user.id}`), {
          id: user.id,
          name: user.name,
          ...(user?.image && { image: user.image }),
          number: players.length,
          score: 0,
        });
      });
    }
  }, [user, players, roomId, room]);

  if (loading || !user) return <p>Loading...</p>;

  switch (room?.gameState.status) {
    case "waiting":
      return (
        <Waiting
          room={room}
          user={user as User}
          onStart={handleStart}
          isPending={isPending}
        />
      );
    case "playing":
      return <Playing room={room} user={user as User} />;
    default:
      return null;
  }
};

export default RoomIdPage;
