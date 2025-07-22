
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: Error | ErrorDetails, fallbackMessage?: string) => {
    let errorMessage: string;
    let errorCode: string | undefined;
    let context: string | undefined;

    if (error instanceof Error) {
      errorMessage = error.message || fallbackMessage || 'An unexpected error occurred';
      errorCode = (error as any).code;
    } else {
      errorMessage = error.message || fallbackMessage || 'An unexpected error occurred';
      errorCode = error.code;
      context = error.context;
    }

    // Log error for debugging in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Details:', { errorMessage, errorCode, context, originalError: error });
    }
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }, [toast]);

  const handleApiError = useCallback((error: any, operation: string) => {
    const errorMessage = error?.message || `Failed to ${operation}`;
    const errorCode = error?.code || 'API_ERROR';
    
    handleError({ 
      message: errorMessage, 
      code: errorCode,
      context: operation 
    });
  }, [handleError]);

  return { handleError, handleApiError };
};
