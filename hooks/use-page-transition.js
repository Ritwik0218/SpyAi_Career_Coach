"use client";

import { useEffect, useRef } from "react";
import { useLoading } from "../components/loading-provider";

export function usePageTransition() {
  const { setLoading } = useLoading();
  const timeoutRef = useRef(null);

  const startLoading = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(true);
    
    // Auto-complete loading after 300ms max
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const stopLoading = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { startLoading, stopLoading };
}
