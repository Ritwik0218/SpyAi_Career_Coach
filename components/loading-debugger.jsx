"use client";

import { useLoading } from "./loading-provider";
import { useEffect } from "react";

export function LoadingDebugger() {
  const { isLoading, loadingProgress } = useLoading();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Loading state:', { isLoading, loadingProgress });
      
      if (isLoading) {
        const startTime = Date.now();
        
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          if (elapsed > 1000) { // Alert if loading takes more than 1 second
            console.warn('⚠️ Loading taking too long:', elapsed + 'ms');
          }
        }, 500);

        return () => clearInterval(interval);
      }
    }
  }, [isLoading, loadingProgress]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] bg-black/80 text-white p-2 rounded text-xs font-mono">
      Loading: {isLoading ? 'YES' : 'NO'} | Progress: {Math.round(loadingProgress)}%
    </div>
  );
}
