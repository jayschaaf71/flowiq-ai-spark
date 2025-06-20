
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type TeamMember = Tables<'team_members'>;
type TeamPerformance = Tables<'team_performance'>;

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team_members'],
    queryFn: async () => {
      console.log('Fetching team members...');
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useTeamPerformance = () => {
  return useQuery({
    queryKey: ['team_performance'],
    queryFn: async () => {
      console.log('Fetching team performance...');
      const { data, error } = await supabase
        .from('team_performance')
        .select(`
          *,
          team_member:team_members(*)
        `)
        .eq('date', new Date().toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching team performance:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamMember: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Adding team member:', teamMember);
      const { data, error } = await supabase
        .from('team_members')
        .insert(teamMember)
        .select()
        .single();

      if (error) {
        console.error('Error adding team member:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TeamMember> & { id: string }) => {
      console.log('Updating team member:', id, updates);
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating team member:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting team member:', id);
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting team member:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
    },
  });
};
