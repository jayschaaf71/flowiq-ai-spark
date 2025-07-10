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
      // Fetch existing users from platform_user_management view
      const { data: existingUsers, error: usersError } = await supabase
        .from('platform_user_management')
        .select('*');
      
      if (usersError) {
        console.error('Error fetching platform users:', usersError);
        throw new Error(usersError.message);
      }

      // Fetch pending invitations from team_invitations table
      const { data: pendingInvitations, error: invitationsError } = await supabase
        .from('team_invitations')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          created_at,
          updated_at,
          status,
          tenant_id,
          tenants:tenant_id (
            name,
            business_name
          )
        `)
        .eq('status', 'pending');

      if (invitationsError) {
        console.error('Error fetching pending invitations:', invitationsError);
        // Don't throw here, just log and continue with existing users
      }

      // Transform pending invitations to match PlatformUser interface
      const pendingUsers: PlatformUser[] = (pendingInvitations || []).map(invitation => ({
        id: invitation.id,
        first_name: invitation.first_name || null,
        last_name: invitation.last_name || null,
        full_name: invitation.first_name && invitation.last_name 
          ? `${invitation.first_name} ${invitation.last_name}` 
          : null,
        email: invitation.email,
        role: invitation.role,
        created_at: invitation.created_at,
        updated_at: invitation.updated_at,
        current_tenant_id: invitation.tenant_id,
        tenant_name: invitation.tenants?.business_name || invitation.tenants?.name || null,
        tenant_user_active: null,
        status: 'pending' as const
      }));

      // Combine existing users with pending invitations
      const allUsers = [
        ...(existingUsers || []).map(user => ({ ...user, status: user.status || 'active' })),
        ...pendingUsers
      ];

      return allUsers as PlatformUser[];
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
      console.log('Starting invitation process for:', { email, role, tenantId });
      
      const { data, error } = await supabase.functions.invoke('send-user-invitation', {
        body: {
          email,
          role,
          tenantId,
          inviterName: 'Platform Admin'
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Error sending invitation:', error);
        throw new Error(error.message || 'Failed to send invitation');
      }

      return data;
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

  // Re-send invite mutation for pending invitations
  const resendInviteMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      // Get the invitation details first
      const { data: invitation, error: fetchError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (fetchError || !invitation) {
        throw new Error('Invitation not found');
      }

      // Call the edge function to resend the invitation
      const { data, error } = await supabase.functions.invoke('send-user-invitation', {
        body: {
          email: invitation.email,
          role: invitation.role,
          tenantId: invitation.tenant_id,
          inviterName: 'Platform Admin'
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to resend invitation');
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Invitation re-sent",
        description: "Invitation has been re-sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error re-sending invitation",
        description: error.message || "Failed to re-send invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Cancel invitation mutation
  const cancelInviteMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) {
        throw new Error(error.message || 'Failed to cancel invitation');
      }

      return { success: true };
    },
    onSuccess: (_, invitationId) => {
      // Update the cache to remove the cancelled invitation
      queryClient.setQueryData(['platform-users'], (oldData: PlatformUser[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(user => user.id !== invitationId);
      });
      
      toast({
        title: "Invitation cancelled",
        description: "Invitation has been cancelled successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error cancelling invitation",
        description: error.message || "Failed to cancel invitation. Please try again.",
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
    resendInvite: resendInviteMutation.mutate,
    isResendingInvite: resendInviteMutation.isPending,
    cancelInvite: cancelInviteMutation.mutate,
    isCancellingInvite: cancelInviteMutation.isPending,
    refetch,
  };
};