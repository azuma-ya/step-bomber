import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const useUpdateUser = () => {
  const [user] = useAuthState(auth);

  if (!user) return;
};
