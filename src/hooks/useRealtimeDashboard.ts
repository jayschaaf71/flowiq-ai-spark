
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeDashboard = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const appointmentsChannel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          // Invalidate and refetch dashboard data when appointments change
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
        }
      )
      .subscribe();

    const patientsChannel = supabase
      .channel('patients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        () => {
          // Invalidate and refetch dashboard data when patients change
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(patientsChannel);
    };
  }, [queryClient]);
};
