"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function ActionLoader({ 
  isLoading, 
  progress = 0, 
  message = "Loading...", 
  success = false, 
  error = false,
  className = "" 
}) {
  return (
    <AnimatePresence>
      {(isLoading || success || error) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-3 p-4 rounded-lg bg-card border ${className}`}
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            {error ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : success ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5 text-blue-500" />
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium">{message}</p>
            
            {isLoading && progress > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
