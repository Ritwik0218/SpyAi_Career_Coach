"use client";

import { motion } from "framer-motion";
import { useLoading } from "./loading-provider";

export function PageTransition({ children, className = "" }) {
  const { isLoading } = useLoading();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isLoading ? 0.3 : 1, 
        y: isLoading ? 10 : 0,
        scale: isLoading ? 0.98 : 1
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: isLoading ? 0.2 : 0.4,
        ease: isLoading ? "easeOut" : [0.25, 0.25, 0, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
