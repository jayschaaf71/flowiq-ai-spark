
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: Error, fallbackMessage?: string) => {
    console.error('Error occurred:', error);
    
    const message = error.message || fallbackMessage || 'An unexpected error occurred';
    
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }, [toast]);

  return { handleError };
};
