
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
      errorCode = 'code' in error ? (error as Record<string, unknown>).code as string : undefined;
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

  const handleApiError = useCallback((error: Record<string, unknown> | Error, operation: string) => {
    const errorMessage = (error instanceof Error ? error.message : (error?.message as string)) || `Failed to ${operation}`;
    const errorCode = (error instanceof Error ? 'code' in error ? (error as Record<string, unknown>).code as string : undefined : error?.code as string) || 'API_ERROR';
    
    handleError({ 
      message: errorMessage, 
      code: errorCode as string,
      context: operation 
    });
  }, [handleError]);

  return { handleError, handleApiError };
};
