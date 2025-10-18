import { useState, useCallback } from "react";

interface LoadingState {
  isLoading: boolean;
  loadingText: string;
  progress?: number;
}

export function useNexusLoading() {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    loadingText: '',
  });

  const startLoading = useCallback((text: string = 'Loading...', progress?: number) => {
    setLoadingState({
      isLoading: true,
      loadingText: text,
      progress,
    });
  }, []);

  const updateLoading = useCallback((text: string, progress?: number) => {
    setLoadingState(prev => ({
      ...prev,
      loadingText: text,
      progress,
    }));
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      loadingText: '',
    });
  }, []);

  const setProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress,
    }));
  }, []);

  return {
    loadingState,
    startLoading,
    updateLoading,
    stopLoading,
    setProgress,
    isLoading: loadingState.isLoading,
    loadingText: loadingState.loadingText,
    progress: loadingState.progress,
  };
}
