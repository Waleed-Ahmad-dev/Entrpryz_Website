"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimateInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  once?: boolean;
}

export function AnimateInView({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 30,
  duration = 0.7,
  once = true,
}: AnimateInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        filter: "blur(6px)",
        ...getInitialPosition(),
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              filter: "blur(0px)",
              x: 0,
              y: 0,
            }
          : {
              opacity: 0,
              filter: "blur(6px)",
              ...getInitialPosition(),
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.32, 0.72, 0, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
