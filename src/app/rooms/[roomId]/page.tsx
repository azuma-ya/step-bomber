"use client";

import { useEffect, useState, useTransition } from "react";

import { ref, remove, update } from "firebase/database";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useData } from "@/hooks/use-data";
import { db } from "@/lib/firebase";
import PlayingPage from "./playing-page";
import WaitingPage from "./waiting-page";

export const runtime = "edge";

const RoomIdPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { roomId } = useParams<{ roomId: string }>();
  const rooms = useData((state) => state.rooms);
  const user = useData((state) => state.user);
  const [isLeaving, setIsLeaving] = useState(true);

  console.log("room id page rendering");

  const room = rooms?.find((room) => room.id === roomId);
  const players = Object.values(room?.players ?? {});

  const handleStart = () => {
    startTransition(async () => {
      await update(ref(db, `rooms/${roomId}/gameState`), {
        status: "playing",
      });
    });
  };

  useEffect(() => {
    if (!user || !isLeaving || !room) return;
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
  }, [user, players, roomId, isLeaving, room]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (room?.players?.[user?.id ?? ""] && isLeaving) {
        if (room?.host === user?.id) {
          remove(ref(db, `rooms/${room.id}`));
        } else {
          remove(ref(db, `rooms/${room.id}/players/${user?.id}`));
        }
        setIsLeaving(false);
      }
    };

    const handleRouteBack = () => {
      handleRouteChange();
      history.back();
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleRouteBack);

    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;

    router.push = (...args) => {
      handleRouteChange();
      history.back();
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      handleRouteChange();
      history.back();
      return originalReplace.apply(router, args);
    };

    router.back = () => {
      handleRouteChange();
      history.back();
      return originalBack.apply(router);
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      window.removeEventListener("popstate", handleRouteBack);
    };
  }, [room, user, router, isLeaving]);

  if (!room) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-var(--header-height)-var(--footer-height))]">
        <Loader2 className="animate-spin " />
      </div>
    );
  }

  switch (room?.gameState.status) {
    case "waiting":
      return (
        <WaitingPage room={room} onStart={handleStart} isPending={isPending} />
      );
    case "playing":
      return <PlayingPage room={room} />;
    default:
      return null;
  }
};

export default RoomIdPage;
