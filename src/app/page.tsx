"use client";

import { useEffect, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { push, ref, set } from "firebase/database";
import { collection, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Room } from "@/features/room/types/room";
import { auth, db, store } from "@/lib/firebase";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useListVals } from "react-firebase-hooks/database";
import { useDocumentData } from "react-firebase-hooks/firestore";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "ニックネームを入力してください")
    .max(20, "ニックネームは20文字以内で入力してください"),
});

const App = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [authUser] = useAuthState(auth);
  const [user] = useDocumentData(
    authUser ? doc(store, "users", authUser.uid) : null,
  );

  const [rooms] = useListVals<Room>(ref(db, "rooms"));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    form.setValue("name", user?.name ?? "");
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!authUser) return;
    const userCollectionRef = collection(store, "users");
    const addDocRef = doc(userCollectionRef, authUser.uid);
    startTransition(async () => {
      await setDoc(addDocRef, {
        id: authUser.uid,
        name: values.name,
        image: authUser.photoURL,
      });
    });
  };

  const onCreateRoom = () => {
    if (!user) return;

    const key = push(ref(db, "rooms")).key;
    startTransition(async () => {
      await set(ref(db, `rooms/${key}`), {
        id: key,
        host: user.id,
        createdAt: new Date(),
        gameState: {
          status: "waiting",
          currentPlayer: null,
        },
      });
      router.push(`/${key}`);
    });
  };

  return (
    <Container className="h-[calc(100vh-var(--header-height)-var(--footer-height))] flex items-center justify-center flex-col gap-6 w-[350px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ニックネーム</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <Input placeholder="ニックネームを入力" {...field} />
                    <Button type="submit" disabled={isPending} className="">
                      変更する
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button
        type="button"
        className="w-full"
        disabled={isPending}
        onClick={onCreateRoom}
      >
        部屋を作成する
      </Button>
      <ul className="w-full space-y-1">
        {rooms
          ?.filter((room) => room.gameState.status === "waiting")
          .map((room) => (
            <li key={room.id}>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/${room.id}`}>{room.host}</Link>
              </Button>
            </li>
          ))}
      </ul>
    </Container>
  );
};

export default App;
