"use client";

import { useAuthModal } from "@/hooks/use-auth-modal";
import { auth, store } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, doc, setDoc } from "firebase/firestore";
import { useTransition } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "ニックネームを入力してください")
    .max(20, "ニックネームは20文字以内で入力してください"),
});

export const AuthModal = () => {
  const { isOpen, onClose } = useAuthModal();
  const [authUser] = useAuthState(auth);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!authUser) return;
    const ref = doc(collection(store, "users"), authUser.uid);
    startTransition(async () => {
      await setDoc(ref, {
        id: authUser.uid,
        name: values.name,
        image: authUser.photoURL,
        points: 0,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.reload();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Please type nickname in to continue.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ニックネーム</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input placeholder="ニックネームを入力" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              作成する
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
