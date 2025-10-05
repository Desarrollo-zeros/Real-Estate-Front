'use client';

import { useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { apiClient } from '@/services/api';

/**
 * LoadingInitializer
 * Connects the global loading context with the apiClient
 */
export function LoadingInitializer() {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    // Register loading callbacks with apiClient
    apiClient.registerLoadingCallbacks({
      start: startLoading,
      stop: stopLoading,
    });
  }, [startLoading, stopLoading]);

  return null; // This component doesn't render anything
}
