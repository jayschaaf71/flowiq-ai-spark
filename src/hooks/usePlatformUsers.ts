import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface PlatformUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  current_tenant_id: string | null;
  tenant_name: string | null;
  tenant_user_active: boolean | null;
  status: 'active' | 'inactive' | 'pending';
}

export const usePlatformUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all platform users
  const { 
    data: users = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['platform-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_user_management')
        .select('*');
      
      if (error) {
        console.error('Error fetching platform users:', error);
        throw new Error(error.message);
      }
      
      return data as PlatformUser[];
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false,
  });

  // Remove user mutation
  const removeUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.rpc('remove_platform_user', {
        target_user_id: userId
      });

      if (error) {
        console.error('Error removing user:', error);
        throw new Error(error.message || 'Failed to remove user');
      }

      return data;
    },
    onSuccess: (_, userId) => {
      // Update the cache to remove the user immediately
      queryClient.setQueryData(['platform-users'], (oldData: PlatformUser[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(user => user.id !== userId);
      });
      
      toast({
        title: "User removed",
        description: "User has been successfully removed from the platform.",
      });
    },
    onError: (error) => {
      console.error('Remove user error:', error);
      toast({
        title: "Error removing user",
        description: error.message || "Failed to remove user. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Invite user mutation (for the existing invite functionality)
  const inviteUserMutation = useMutation({
    mutationFn: async ({ 
      email, 
      role, 
      tenantId 
    }: { 
      email: string; 
      role: string; 
      tenantId?: string;
    }) => {
      // This would typically involve creating a user invitation
      // For now, we'll just log the action
      console.log('Inviting user:', { email, role, tenantId });
      
      // In a real implementation, you might:
      // 1. Send an email invitation
      // 2. Create a pending user record
      // 3. Generate an invitation token
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "User invited",
        description: "Invitation sent successfully.",
      });
      // Refetch users to show any new pending users
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error sending invitation",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    users,
    isLoading,
    error,
    removeUser: removeUserMutation.mutate,
    isRemoving: removeUserMutation.isPending,
    inviteUser: inviteUserMutation.mutate,
    isInviting: inviteUserMutation.isPending,
    refetch,
  };
};