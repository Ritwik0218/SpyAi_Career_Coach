"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function RouteTransitionEnhancer({ children }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        ease: "easeOut"
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
