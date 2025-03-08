"use client";

import { motion } from "framer-motion";

import { Container, type ContainerProps } from "./container";

export const AnimatedContainer = ({ children, ...props }: ContainerProps) => {
  return (
    <motion.div
      layout
      transition={{
        layout: { type: "spring", damping: 20, stiffness: 150 },
      }}
    >
      <Container {...props}>{children}</Container>
    </motion.div>
  );
};
