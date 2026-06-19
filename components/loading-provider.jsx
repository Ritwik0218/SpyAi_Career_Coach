"use client";

import { createContext, useContext, useState, useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ClientOnly } from "./client-only";

const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  loadingProgress: 0,
  routeInfo: null,
});

function LoadingProviderInner({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [routeInfo, setRouteInfo] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef(null);
  const progressRef = useRef(null);
  const previousPathnameRef = useRef(pathname);
  const loadingStartTime = useRef(null);

  // Get route information for better UX
  const getRouteInfo = (path) => {
    const routes = {
      '/': { name: 'Home', icon: '🏠' },
      '/dashboard': { name: 'Dashboard', icon: '📊' },
      '/resume': { name: 'Resume Builder', icon: '📄' },
      '/resume/ats-analysis': { name: 'ATS Analysis', icon: '🎯' },
      '/ai-cover-letter': { name: 'Cover Letter', icon: '✉️' },
      '/interview': { name: 'Interview Prep', icon: '🎤' },
      '/interview/mock': { name: 'Mock Interview', icon: '🗣️' },
      '/onboarding': { name: 'Getting Started', icon: '🚀' },
    };
    
    return routes[path] || { name: 'Loading Page', icon: '⚡' };
  };

  // Clear loading function
  const clearLoading = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setIsLoading(false);
    setLoadingProgress(0);
    loadingStartTime.current = null;
  };

  useEffect(() => {
    // Clear any existing timers
    clearLoading();
    
    // On first mount, just set up the route info without loading
    if (!hasInitialized) {
      setHasInitialized(true);
      setRouteInfo(getRouteInfo(pathname));
      previousPathnameRef.current = pathname;
      return;
    }
    
    // Only show loading if the pathname actually changed (route navigation)
    if (previousPathnameRef.current === pathname) {
      return;
    }
    
    // Update previous pathname reference
    previousPathnameRef.current = pathname;
    
    // Record loading start time
    loadingStartTime.current = Date.now();
    
    // Show loading for actual route changes
    setIsLoading(true);
    setLoadingProgress(0);
    setRouteInfo(getRouteInfo(pathname));
    
    // Faster progress simulation
    let progress = 0;
    progressRef.current = setInterval(() => {
      progress += Math.random() * 25 + 15; // Faster progress
      if (progress > 85) progress = 85; // Cap at 85% until completion
      setLoadingProgress(progress);
    }, 60); // Faster intervals
    
    // Complete loading faster and ensure it stops
    timeoutRef.current = setTimeout(() => {
      if (progressRef.current) clearInterval(progressRef.current);
      setLoadingProgress(100);
      
      // Hide loader quickly
      setTimeout(() => {
        clearLoading();
      }, 100);
    }, 300); // Much shorter duration - 300ms

    return () => {
      clearLoading();
    };
  }, [pathname, searchParams, hasInitialized]);

  // Additional effect to handle page load completion
  useEffect(() => {
    const handleComplete = () => {
      // If loading has been going on for more than 200ms, complete it
      if (loadingStartTime.current && Date.now() - loadingStartTime.current > 200) {
        clearLoading();
      }
    };

    // Listen for page load events
    if (typeof window !== 'undefined') {
      window.addEventListener('load', handleComplete);
      document.addEventListener('DOMContentLoaded', handleComplete);
      
      // Force clear after 500ms maximum
      const maxTimeout = setTimeout(clearLoading, 500);

      return () => {
        window.removeEventListener('load', handleComplete);
        document.removeEventListener('DOMContentLoaded', handleComplete);
        clearTimeout(maxTimeout);
      };
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      setLoading: setIsLoading, 
      loadingProgress,
      routeInfo 
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function LoadingProvider({ children }) {
  return (
    <Suspense fallback={<CuteLoader />}>
      <LoadingProviderInner>
        {children}
      </LoadingProviderInner>
    </Suspense>
  );
}

function CuteLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#09090b] text-foreground z-50">
      <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl bg-[#18181b]/80 border border-zinc-800 shadow-2xl backdrop-blur-md">
        <div className="relative">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center relative overflow-hidden shadow-lg shadow-primary/30">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-10 h-10 text-primary-foreground z-10 animate-pulse"
            >
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z" />
            </svg>
            <div className="absolute inset-1 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin [animation-duration:1.5s]" />
          </div>
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping [animation-duration:2.5s]" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            SPY AI
          </h3>
          <p className="text-sm text-zinc-400">
            Preparing your career coach experience...
          </p>
        </div>
      </div>
    </div>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};
