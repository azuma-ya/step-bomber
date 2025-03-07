"use client";

import { Menu } from "lucide-react";

import useMainSidebar from "@/hooks/use-main-sidebar";
import { Button } from "../ui/button";

export const MainSidebarButton = () => {
  const onOpen = useMainSidebar((state) => state.onOpen);

  return (
    <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpen}>
      <Menu className="size-5!" />
    </Button>
  );
};
