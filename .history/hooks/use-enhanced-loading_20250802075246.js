"use client";

import { useState, useCallback } from "react";
import { useLoading } from "@/components/loading-provider";

export function useEnhancedLoading() {
  const { isLoading: globalLoading, setLoading: setGlobalLoading } = useLoading();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionProgress, setActionProgress] = useState(0);
  const [actionMessage, setActionMessage] = useState("");

  const startAction = useCallback((message = "Processing...") => {
    setActionLoading(true);
    setActionProgress(0);
    setActionMessage(message);
  }, []);

  const updateActionProgress = useCallback((progress, message) => {
    setActionProgress(progress);
    if (message) setActionMessage(message);
  }, []);

  const finishAction = useCallback(() => {
    setActionProgress(100);
    setTimeout(() => {
      setActionLoading(false);
      setActionProgress(0);
      setActionMessage("");
    }, 300);
  }, []);

  const withLoading = useCallback(async (asyncFn, message = "Processing...") => {
    startAction(message);
    try {
      const result = await asyncFn();
      finishAction();
      return result;
    } catch (error) {
      finishAction();
      throw error;
    }
  }, [startAction, finishAction]);

  return {
    isLoading: globalLoading || actionLoading,
    isGlobalLoading: globalLoading,
    isActionLoading: actionLoading,
    actionProgress,
    actionMessage,
    startAction,
    updateActionProgress,
    finishAction,
    withLoading,
    setGlobalLoading,
  };
}
