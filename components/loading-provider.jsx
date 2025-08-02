"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  loadingProgress: 0,
  routeInfo: null,
});

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [routeInfo, setRouteInfo] = useState(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef(null);
  const progressRef = useRef(null);

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
    
    // Start loading immediately
    setIsLoading(true);
    setLoadingProgress(0);
    setRouteInfo(getRouteInfo(pathname));
    
    // Simulate loading progress
    let progress = 0;
    progressRef.current = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) progress = 90;
      setLoadingProgress(progress);
    }, 100);
    
    // Stop loading after component has had time to mount
    timeoutRef.current = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 200);
    }, Math.random() * 300 + 400); // Random between 400-700ms for natural feel

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [pathname, searchParams]);

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

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};
