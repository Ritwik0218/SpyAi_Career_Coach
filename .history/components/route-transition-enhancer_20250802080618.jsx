"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "./loading-provider";

export function RouteTransitionEnhancer({ children }) {
  const pathname = usePathname();
  const { isLoading } = useLoading();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsTransitioning(true);
    } else {
      // Small delay to allow content to render before showing
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isTransitioning ? (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
            className="w-full"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full min-h-[200px] flex items-center justify-center"
          >
            {/* This will be handled by the main PageLoader */}
            <div className="opacity-0">Loading...</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
