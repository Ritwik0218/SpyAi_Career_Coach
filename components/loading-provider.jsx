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
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingProviderInner>
        {children}
      </LoadingProviderInner>
    </Suspense>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};
