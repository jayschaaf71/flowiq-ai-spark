
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export const useTenantSwitching = () => {
  const [isSwitching, setIsSwitching] = useState(false);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const switchTenant = async (tenantId: string) => {
    try {
      setIsSwitching(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Tenant Switched",
        description: "Successfully switched to the selected tenant.",
      });
      
      // In a real app, this would update the user's session
      console.log('Switched to tenant:', tenantId);
    } catch (error) {
      console.error('Error switching tenant:', error);
      handleError(error as Error, 'Failed to switch tenant');
    } finally {
      setIsSwitching(false);
    }
  };

  return {
    switchTenant,
    isSwitching
  };
};
