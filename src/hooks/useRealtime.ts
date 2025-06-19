
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['patients'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medical_history'
        },
        (payload) => {
          const patientId = (payload.new as any)?.patient_id || (payload.old as any)?.patient_id;
          if (patientId) {
            queryClient.invalidateQueries({ queryKey: ['medical_history', patientId] });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medications'
        },
        (payload) => {
          const patientId = (payload.new as any)?.patient_id || (payload.old as any)?.patient_id;
          if (patientId) {
            queryClient.invalidateQueries({ queryKey: ['medications', patientId] });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'file_attachments'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['file_attachments'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'soap_notes'
        },
        (payload) => {
          const patientId = (payload.new as any)?.patient_id || (payload.old as any)?.patient_id;
          if (patientId) {
            queryClient.invalidateQueries({ queryKey: ['soap_notes', patientId] });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointment_waitlist'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['appointment_waitlist'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recurring_appointments'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['recurring_appointments'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
