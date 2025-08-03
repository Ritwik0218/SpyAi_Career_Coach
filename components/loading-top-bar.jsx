"use client";

import { useLoading } from "./loading-provider";
import { motion, AnimatePresence } from "framer-motion";
import { ClientOnly } from "./client-only";

export function LoadingTopBar() {
  const { isLoading, loadingProgress } = useLoading();

  return (
    <ClientOnly fallback={null}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 origin-left"
          >
          {/* Main progress bar */}
          <div className="h-1 bg-primary shadow-sm shadow-primary/20">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full bg-primary-foreground/30"
            />
          </div>
          
          {/* Animated shimmer effect */}
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 h-1 w-1/4 bg-primary-foreground/40"
          />
          
          {/* Subtle glow */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-1 bg-primary/20 blur-sm"
          />
        </motion.div>
      )}
    </AnimatePresence>
    </ClientOnly>
  );
}
