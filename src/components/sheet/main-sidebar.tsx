"use client";

import { useRouter } from "next/navigation";

import { Navigation } from "@/components/base/navigation";
import useMainSidebar from "@/hooks/use-main-sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

export const MainSidebar = () => {
  const router = useRouter();
  const { isOpen, onClose } = useMainSidebar();

  const onNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-start">Step Bunmer</SheetTitle>
          <SheetDescription className="text-start">
            maked by Azuma-ya
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col justify-center h-full gap-8 p-4">
          <Navigation orientation="vertical" onClick={onNavigate} />
        </div>
        <SheetFooter>
          <p className="text-muted-foreground text-center text-xs">
            &copy; {new Date().getFullYear()} Azuma-ya
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
