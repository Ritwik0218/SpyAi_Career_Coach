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

  useEffect(() => {
    // Clear any existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    
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
    
    // Show loading for actual route changes
    setIsLoading(true);
    setLoadingProgress(0);
    setRouteInfo(getRouteInfo(pathname));
    
    // Simulate loading progress with more consistent timing
    let progress = 0;
    progressRef.current = setInterval(() => {
      progress += Math.random() * 20 + 10; // More consistent progress
      if (progress > 90) progress = 90;
      setLoadingProgress(progress);
    }, 80);
    
    // Stop loading after a fixed time to prevent indefinite loading
    timeoutRef.current = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 150);
    }, 400); // Fixed 400ms duration

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [pathname, searchParams, hasInitialized]);

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
