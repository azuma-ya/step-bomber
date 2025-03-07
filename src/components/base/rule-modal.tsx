"use client";

import { FileText } from "lucide-react";
import Rule from "../../../public/rule.mdx";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const RuleModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <FileText className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full rounded-sm">
        <DialogHeader>
          <DialogTitle>Step Bommer Rule</DialogTitle>
          <DialogDescription>This is rule of Step Bommer</DialogDescription>
        </DialogHeader>
        <div className="markdown">
          <Rule />
        </div>
      </DialogContent>
    </Dialog>
  );
};
