
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useTenantSwitching = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  const queryClient = useQueryClient();

  // Update user's primary tenant preference
  const switchTenant = useMutation({
    mutationFn: async (tenantId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          primary_tenant_id: tenantId,
          last_active_tenant_id: tenantId 
        })
        .eq('id', user.id);
      
      if (error) throw error;
      return tenantId;
    },
    onSuccess: async (tenantId) => {
      // Refresh the user's profile to get updated tenant info
      await refreshProfile();
      
      // Invalidate all tenant-related queries to refetch with new context
      await queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      await queryClient.invalidateQueries({ queryKey: ['tenants'] });
      
      toast({
        title: "Tenant switched successfully",
        description: "Your workspace has been updated.",
      });
    },
    onError: (error) => {
      console.error('Tenant switch error:', error);
      toast({
        title: "Failed to switch tenant",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    switchTenant: switchTenant.mutate,
    isSwitching: switchTenant.isPending,
  };
};
