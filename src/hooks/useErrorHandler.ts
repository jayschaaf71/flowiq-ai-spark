
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  customMessage?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error | string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      customMessage
    } = options;

    const errorMessage = typeof error === 'string' ? error : error.message;
    const displayMessage = customMessage || errorMessage;

    if (logError) {
      console.error('Error handled:', error);
    }

    if (showToast) {
      toast({
        title: 'Error',
        description: displayMessage,
        variant: 'destructive',
      });
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service like Sentry
      console.error('Production error tracked:', { error, options });
    }
  }, [toast]);

  const handleApiError = useCallback((error: any) => {
    let message = 'An unexpected error occurred';
    
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }

    handleError(message, { customMessage: message });
  }, [handleError]);

  return {
    handleError,
    handleApiError,
  };
};
