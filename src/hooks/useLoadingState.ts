
import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export const useLoadingState = (initialStates: string[] = []) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>(() => {
    const initial: LoadingState = {};
    initialStates.forEach(state => {
      initial[state] = false;
    });
    return initial;
  });

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    loadingStates
  };
};
