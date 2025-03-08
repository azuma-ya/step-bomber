"use client";

import { useEffect } from "react";

import { onValue, ref } from "firebase/database";
import { doc, onSnapshot } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

import { useAuthModal } from "@/hooks/use-auth-modal";
import { useData } from "@/hooks/use-data";
import { auth, db, store } from "@/lib/firebase";
import type { User } from "@/types/user";

export const FirebaseSubscriber = () => {
  const [user, loading] = useAuthState(auth);
  const setRooms = useData((state) => state.setRooms);
  const setUser = useData((state) => state.setUser);
  const onOpen = useAuthModal((state) => state.onOpen);
  const pathname = usePathname();

  // Rooms subscription
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onValue(ref(db, "rooms"), (snapshot) => {
      const rooms = snapshot.val();
      setRooms(Object.values(rooms ?? {}));
    });

    return () => {
      unsubscribe();
    };
  }, [setRooms, user]);

  // User subscription
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(store, "users", user.uid),
      (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.data() as User;
        setUser(data);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user, setUser]);

  useEffect(() => {
    if (loading || pathname === "/") return;
    if (!user) onOpen();
  }, [loading, user, onOpen, pathname]);

  return null;
};
