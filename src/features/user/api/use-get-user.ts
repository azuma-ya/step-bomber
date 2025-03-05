import { FirebaseError } from "firebase/app";
import {
  type DocumentSnapshot,
  type FirestoreDataConverter,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";

import { auth, store } from "@/lib/firebase";
import type { User } from "../types/user";

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: User) => {
    return {
      id: user.id,
      name: user.name,
      image: user.image,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      image: data.image,
    } as User;
  },
};

export const useGetUser = (): [
  User | undefined,
  boolean,
  FirebaseError | undefined,
  DocumentSnapshot<User> | undefined,
  () => Promise<void>,
] => {
  const [authUser] = useAuthState(auth);

  if (!authUser)
    return [undefined, false, new FirebaseError("404", "User not found")];

  return useDocumentDataOnce(doc(store, "users", authUser.uid));
};
