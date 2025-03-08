"use client";

import type React from "react";
import { useState } from "react";

import type { VariantProps } from "class-variance-authority";

import { useIsMobile } from "@/hooks/use-mobile";
import type { Config } from "@/types/room";
import { Button, type buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

export const ModeModalButton = ({
  children,
  onCreateRoom,
  text,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    onCreateRoom: (config: Config) => void;
    text: string;
  }) => {
  const isMobile = useIsMobile();

  const [gridSize, setGridSize] = useState(7);
  const [isVisibleBombs, setIsVisibleBombs] = useState(false);

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button {...props}>{children}</Button>
        </DrawerTrigger>
        <DrawerContent
          className="min-h-1/2"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader>
            <DrawerTitle>ゲーム設定</DrawerTitle>
            <DialogDescription>
              グリッドサイズ、爆弾の表示を設定できます
            </DialogDescription>
          </DrawerHeader>
          <div className="px-4">
            <Form
              gridSize={gridSize}
              setGridSize={setGridSize}
              isVisibleBombs={isVisibleBombs}
              setIsVisibleBombs={setIsVisibleBombs}
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                onClick={() => onCreateRoom({ gridSize, isVisibleBombs })}
              >
                {text}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>{children}</Button>
      </DialogTrigger>
      <DialogContent className="" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>ゲーム設定</DialogTitle>
          <DialogDescription>
            グリッドサイズ、爆弾の表示を設定できます
          </DialogDescription>
        </DialogHeader>
        <Form
          gridSize={gridSize}
          setGridSize={setGridSize}
          isVisibleBombs={isVisibleBombs}
          setIsVisibleBombs={setIsVisibleBombs}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => onCreateRoom({ gridSize, isVisibleBombs })}>
              {text}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Form = ({
  gridSize,
  setGridSize,
  isVisibleBombs,
  setIsVisibleBombs,
}: {
  gridSize: number;
  setGridSize: (gridSize: number) => void;
  isVisibleBombs: boolean;
  setIsVisibleBombs: (isVisibleBombs: boolean) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>グリッドサイズ</Label>
        <div className="flex items-center gap-2">
          <Input
            value={`0${gridSize.toString()}`.slice(-2)}
            readOnly
            className="w-11"
          />
          <Slider
            className="flex-1"
            defaultValue={[gridSize]}
            max={11}
            min={5}
            step={2}
            onValueChange={(value) => setGridSize(value[0])}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>自分の爆弾の表示</Label>
        <div className="flex items-center justify-between gap-2">
          <Switch
            checked={isVisibleBombs}
            onCheckedChange={setIsVisibleBombs}
          />
          <p className="">{isVisibleBombs ? "ON" : "OFF"}</p>
        </div>
      </div>
    </div>
  );
};
