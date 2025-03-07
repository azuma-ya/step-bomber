"use client";

import { useEffect } from "react";

import { useData } from "@/hooks/use-data";
import { auth, db, store } from "@/lib/firebase";
import type { User } from "@/types/user";
import { onValue, ref } from "firebase/database";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export const FirebaseSubscriber = () => {
  const [authUser] = useAuthState(auth);
  const setRooms = useData((state) => state.setRooms);
  const setUser = useData((state) => state.setUser);

  // Rooms subscription
  useEffect(() => {
    const unsubscribe = onValue(ref(db, "rooms"), (snapshot) => {
      const rooms = snapshot.val();
      setRooms(Object.values(rooms ?? {}));
    });

    return () => {
      unsubscribe();
    };
  }, [setRooms]);

  // User subscription
  useEffect(() => {
    if (!authUser?.uid) return;

    const unsubscribe = onSnapshot(
      doc(store, "users", authUser.uid),
      (snapshot) => {
        if (!snapshot.exists()) return;
        const user = snapshot.data() as User;
        setUser(user);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [authUser?.uid, setUser]);

  return null;
};
