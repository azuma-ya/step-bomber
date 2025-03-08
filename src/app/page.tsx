"use client";

import { useEffect, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { push, ref, set } from "firebase/database";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { IconSelectButton } from "@/components/icon-select";
import { Container } from "@/components/layout/container";
import { ModeModalButton } from "@/components/modal/mode-modal";
import { RoomItem } from "@/components/room-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { signInAnonymously } from "firebase/auth";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "ニックネームを入力してください")
    .max(20, "ニックネームは20文字以内で入力してください"),
  image: z.string().optional(),
});

const App = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const user = useData((state) => state.user);
  const rooms = useData((state) => state.rooms);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  useEffect(() => {
    form.setValue("name", user?.name ?? "");
    form.setValue("image", user?.image ?? "");
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (user) {
      startTransition(async () => {
        await updateDoc(doc(collection(store, "users"), user.id), {
          name: values.name,
          image: values.image,
        });
      });
      return;
    }

    startTransition(async () => {
      const { user } = await signInAnonymously(auth);
      await setDoc(doc(collection(store, "users"), user.uid), {
        id: user.uid,
        name: values.name,
        image: user.photoURL,
        points: 0,
      });
      router.refresh();
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex gap-6 flex-col items-start"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <IconSelectButton
                    variant="ghost"
                    size="icon"
                    className="rounded-full size-min"
                    onSelectIcon={(icon: string) => {
                      field.onChange(icon);
                    }}
                  >
                    <Avatar className="size-16">
                      <AvatarImage src={field.value} />
                      <AvatarFallback className="text-xl">
                        {user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </IconSelectButton>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
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
          .slice(0, 5)
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
