"use client";

import { type ReactNode, useEffect } from "react";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) signInAnonymously(auth);
    });
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
