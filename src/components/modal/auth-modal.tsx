"use client";

import { useAuthModal } from "@/hooks/use-auth-modal";
import { auth, store } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInAnonymously } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
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
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const { user } = await signInAnonymously(auth);
      await setDoc(doc(collection(store, "users"), user.uid), {
        id: user.uid,
        name: values.name,
        image: user.photoURL,
        points: 0,
      });
      onClose();
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Authentication</AlertDialogTitle>
          <AlertDialogDescription>
            Please type nickname in to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
      </AlertDialogContent>
    </AlertDialog>
  );
};
