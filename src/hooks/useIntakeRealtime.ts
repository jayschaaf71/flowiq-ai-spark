
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useIntakeRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set up real-time subscription for intake submissions
    const submissionsChannel = supabase
      .channel('intake-submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'intake_submissions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['intake-submissions'] });
        }
      )
      .subscribe();

    // Set up real-time subscription for intake forms
    const formsChannel = supabase
      .channel('intake-forms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'intake_forms'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['intake-forms'] });
        }
      )
      .subscribe();

    // Set up real-time subscription for staff assignments
    const assignmentsChannel = supabase
      .channel('staff-assignments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff_assignments'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['staff-assignments'] });
          queryClient.invalidateQueries({ queryKey: ['intake-submissions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(submissionsChannel);
      supabase.removeChannel(formsChannel);
      supabase.removeChannel(assignmentsChannel);
    };
  }, [queryClient]);
};
