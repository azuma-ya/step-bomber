"use client";

import { useEffect, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { push, ref, set } from "firebase/database";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Container } from "@/components/layout/container";
import { ModeModalButton } from "@/components/modal/mode-modal";
import { RoomItem } from "@/components/room-item";
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
import { useData } from "@/hooks/use-data";
import { auth, db, store } from "@/lib/firebase";
import type { Config } from "@/types/room";

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
  const user = useData((state) => state.user);
  const rooms = useData((state) => state.rooms);

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
    const ref = doc(collection(store, "users"), authUser.uid);
    if (user) {
      startTransition(async () => {
        await updateDoc(ref, {
          name: values.name,
        });
      });
      return;
    }
    startTransition(async () => {
      await setDoc(ref, {
        id: authUser.uid,
        name: values.name,
        image: authUser.photoURL,
        points: 0,
      });
      window.location.reload();
    });
  };

  const handleCreateRoom = (config: Config) => {
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
        config,
      });
      router.push(`/rooms/${key}`);
    });
  };

  return (
    <Container className="h-[calc(100vh-var(--header-height)-var(--footer-height))] flex items-center justify-center flex-col gap-6 md:w-[350px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
                      {user ? "変更する" : "作成する"}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <ModeModalButton
        type="button"
        className="w-full"
        disabled={isPending || !user}
        onCreateRoom={handleCreateRoom}
      >
        部屋を作成する
      </ModeModalButton>
      <ul className="w-full space-y-1">
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
    </Container>
  );
};

export default App;
