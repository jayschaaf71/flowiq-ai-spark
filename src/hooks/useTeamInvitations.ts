
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface TeamInvitation {
  id: string;
  tenant_id: string;
  invited_by: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  department?: string;
  personal_message?: string;
  invitation_token: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}

interface InviteTeamMemberData {
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  personalMessage?: string;
}

export const useTeamInvitations = (tenantId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch invitations for a tenant
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['team-invitations', tenantId],
    queryFn: async () => {
      if (!tenantId) return [];

      const { data, error } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TeamInvitation[];
    },
    enabled: !!tenantId && !!user,
  });

  // Send invitation mutation
  const sendInvitationMutation = useMutation({
    mutationFn: async (inviteData: InviteTeamMemberData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('team_invitations')
        .insert([{
          tenant_id: inviteData.tenantId,
          invited_by: user.id,
          email: inviteData.email,
          first_name: inviteData.firstName,
          last_name: inviteData.lastName,
          role: inviteData.role,
          department: inviteData.department,
          personal_message: inviteData.personalMessage,
        }])
        .select()
        .single();

      if (error) throw error;

      // Send invitation email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          invitation: data,
          inviterName: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim()
        }
      });

      if (emailError) {
        console.error('Error sending invitation email:', emailError);
        // Don't throw error here - the invitation was created successfully
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invitations'] });
      toast({
        title: 'Invitation sent!',
        description: 'Team member invitation has been sent successfully.',
      });
    },
    onError: (error) => {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Error sending invitation',
        description: 'Failed to send team member invitation. Please try again.',
        variant: 'destructive'
      });
    },
  });

  // Resend invitation mutation
  const resendInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const invitation = invitations?.find(inv => inv.id === invitationId);
      if (!invitation) throw new Error('Invitation not found');

      // Send invitation email via edge function
      const { error } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          invitation,
          inviterName: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim()
        }
      });

      if (error) throw error;
      
      return invitation;
    },
    onSuccess: () => {
      toast({
        title: 'Invitation resent!',
        description: 'Team member invitation has been resent successfully.',
      });
    },
  });

  // Revoke invitation mutation
  const revokeInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data, error } = await supabase
        .from('team_invitations')
        .update({ status: 'revoked' })
        .eq('id', invitationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invitations'] });
      toast({
        title: 'Invitation revoked',
        description: 'Team member invitation has been revoked.',
      });
    },
  });

  return {
    invitations: invitations || [],
    isLoading,
    sendInvitation: sendInvitationMutation.mutate,
    isSending: sendInvitationMutation.isPending,
    resendInvitation: resendInvitationMutation.mutate,
    isResending: resendInvitationMutation.isPending,
    revokeInvitation: revokeInvitationMutation.mutate,
    isRevoking: revokeInvitationMutation.isPending,
  };
};
