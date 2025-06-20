
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
    mutationFn: async (teamMember: {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      role: string;
      specialty?: string;
      hire_date?: string | null;
      hourly_rate?: number | null;
      salary?: number | null;
      emergency_contact_name?: string;
      emergency_contact_phone?: string;
      notes?: string;
    }) => {
      console.log('Adding team member:', teamMember);
      
      // Add required fields with defaults
      const memberData = {
        ...teamMember,
        status: 'active' as const,
        avatar_url: null,
        working_hours: {
          monday: { start: "09:00", end: "17:00" },
          tuesday: { start: "09:00", end: "17:00" },
          wednesday: { start: "09:00", end: "17:00" },
          thursday: { start: "09:00", end: "17:00" },
          friday: { start: "09:00", end: "17:00" },
          saturday: null,
          sunday: null
        },
        created_by: null,
        updated_by: null
      };

      const { data, error } = await supabase
        .from('team_members')
        .insert(memberData)
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
