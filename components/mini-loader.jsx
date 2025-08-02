"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function MiniLoader({ 
  isLoading = false, 
  progress = 0, 
  size = "sm", 
  variant = "spinner",
  success = false,
  error = false,
  children 
}) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4", 
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const containerSizes = {
    xs: "gap-1 text-xs",
    sm: "gap-2 text-sm",
    md: "gap-2 text-base", 
    lg: "gap-3 text-lg"
  };

  if (success) {
    return (
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`inline-flex items-center ${containerSizes[size]} text-green-600`}
      >
        <CheckCircle className={sizeClasses[size]} />
        {children}
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`inline-flex items-center ${containerSizes[size]} text-destructive`}
      >
        <AlertCircle className={sizeClasses[size]} />
        {children}
      </motion.div>
    );
  }

  if (!isLoading) {
    return children ? <span>{children}</span> : null;
  }

  if (variant === "spinner") {
    return (
      <div className={`inline-flex items-center ${containerSizes[size]} text-primary`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className={sizeClasses[size]} />
        </motion.div>
        {children}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={`inline-flex items-center ${containerSizes[size]}`}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`${sizeClasses[size]} bg-primary rounded-full`}
        />
        {children}
      </div>
    );
  }

  if (variant === "progress" && progress > 0) {
    return (
      <div className={`inline-flex items-center ${containerSizes[size]} min-w-0`}>
        <div className="flex-1 min-w-0">
          <div className="w-full bg-muted rounded-full h-1">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-1 bg-primary rounded-full"
            />
          </div>
        </div>
        {children && (
          <span className="ml-2 text-muted-foreground whitespace-nowrap">
            {children}
          </span>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={`inline-flex items-center ${containerSizes[size]}`}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          ))}
        </div>
        {children && <span className="ml-2">{children}</span>}
      </div>
    );
  }

  return null;
}
