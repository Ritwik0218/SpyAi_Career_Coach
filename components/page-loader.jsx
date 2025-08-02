"use client";

import { useLoading } from "./loading-provider";
import { Loader2, Brain, Zap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PageLoader() {
  const { isLoading, loadingProgress, routeInfo } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
            className="flex flex-col items-center space-y-6 p-8 rounded-2xl bg-card/80 border shadow-2xl backdrop-blur-sm"
          >
            {/* Animated Logo/Icon */}
            <motion.div
              className="relative"
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center relative overflow-hidden shadow-lg shadow-primary/30">
                <Brain className="w-10 h-10 text-primary-foreground z-10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-1 border-2 border-primary-foreground/30 border-t-primary-foreground/80 rounded-full"
                />
              </div>
              
              {/* Pulsing rings */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-primary/20 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 bg-primary/10 rounded-full"
              />
            </motion.div>

            {/* Route Info & Loading Text */}
            <div className="text-center space-y-3">
              {routeInfo && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-lg">{routeInfo.icon}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-medium">{routeInfo.name}</span>
                </motion.div>
              )}
              
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                Loading...
              </motion.h3>
              
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-muted-foreground flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-yellow-500" />
                Preparing your AI Career Coach experience
              </motion.p>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full relative shadow-sm"
                >
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-primary-foreground/30 w-1/3"
                  />
                </motion.div>
              </div>
            </div>

            {/* Loading dots */}
            <motion.div 
              className="flex space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
