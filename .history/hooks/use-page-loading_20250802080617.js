"use client";

import { useLoading } from "@/components/loading-provider";
import { useEffect } from "react";

export function usePageLoading(isLoading) {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);
}

export function useAsyncLoading() {
  const { setLoading } = useLoading();

  const withLoading = async (asyncFunction) => {
    setLoading(true);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      setTimeout(() => setLoading(false), 300); // Small delay for better UX
    }
  };

  return { withLoading };
}
