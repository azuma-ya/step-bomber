"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  skipInitialAnimationIndexes?: number[];
}

export const AnimatedList = React.memo(
  ({ className, children, skipInitialAnimationIndexes }: AnimatedListProps) => {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <AnimatePresence mode="popLayout">
          {React.Children.map(children, (child, index) => (
            <AnimatedListItem
              key={index}
              skipInitialAnimation={skipInitialAnimationIndexes?.includes(
                index,
              )}
            >
              {child}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";

export interface AnimatedListItemProps {
  children: React.ReactNode;
  skipInitialAnimation?: boolean;
}

export function AnimatedListItem({
  children,
  skipInitialAnimation,
}: AnimatedListItemProps) {
  const animations = {
    initial: skipInitialAnimation
      ? { scale: 1, opacity: 1 }
      : { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}
