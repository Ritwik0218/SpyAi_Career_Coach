"use client";

import { useState, useCallback } from "react";
import { useLoading } from "@/components/loading-provider";

export function useActionLoading() {
  const [actionStates, setActionStates] = useState({});
  const { setLoading } = useLoading();

  const startAction = useCallback((actionId, options = {}) => {
    const { 
      showGlobalLoader = false, 
      timeout = 30000,
      description = "Processing..."
    } = options;

    setActionStates(prev => ({
      ...prev,
      [actionId]: {
        isLoading: true,
        progress: 0,
        description,
        startTime: Date.now()
      }
    }));

    if (showGlobalLoader) {
      setLoading(true);
    }

    // Auto-timeout protection
    const timeoutId = setTimeout(() => {
      setActionStates(prev => {
        const newState = { ...prev };
        delete newState[actionId];
        return newState;
      });
      if (showGlobalLoader) {
        setLoading(false);
      }
    }, timeout);

    return actionId;
  }, [setLoading]);

  const updateProgress = useCallback((actionId, progress, description) => {
    setActionStates(prev => ({
      ...prev,
      [actionId]: prev[actionId] ? {
        ...prev[actionId],
        progress: Math.min(100, Math.max(0, progress)),
        ...(description && { description })
      } : undefined
    }));
  }, []);

  const finishAction = useCallback((actionId, options = {}) => {
    const { showGlobalLoader = false } = options;

    setActionStates(prev => {
      const newState = { ...prev };
      delete newState[actionId];
      return newState;
    });

    if (showGlobalLoader) {
      setLoading(false);
    }
  }, [setLoading]);

  const getActionState = useCallback((actionId) => {
    return actionStates[actionId] || { isLoading: false, progress: 0 };
  }, [actionStates]);

  const isAnyActionLoading = Object.values(actionStates).some(state => state.isLoading);

  return {
    startAction,
    updateProgress,
    finishAction,
    getActionState,
    isAnyActionLoading,
    activeActions: Object.keys(actionStates)
  };
}
