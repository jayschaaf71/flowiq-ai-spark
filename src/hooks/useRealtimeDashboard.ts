
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDashboard } from '@/contexts/DashboardContext';

export const useRealtimeDashboard = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useDashboard();

  useEffect(() => {
    // Set up real-time subscription for appointments
    const appointmentsChannel = supabase
      .channel('dashboard-appointments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
          
          // Add notification based on event type
          if (payload.eventType === 'INSERT') {
            addNotification({
              type: 'info',
              title: 'New Appointment',
              message: 'A new appointment has been scheduled'
            });
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for patients
    const patientsChannel = supabase
      .channel('dashboard-patients')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('Patient change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['patients'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-patient'] });
          
          if (payload.eventType === 'INSERT') {
            addNotification({
              type: 'success',
              title: 'New Patient',
              message: 'A new patient has been registered'
            });
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for intake submissions
    const intakeChannel = supabase
      .channel('dashboard-intake')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'intake_submissions'
        },
        (payload) => {
          console.log('Intake submission change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['intake-submissions'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
          
          if (payload.eventType === 'INSERT') {
            addNotification({
              type: 'info',
              title: 'New Intake Submission',
              message: 'A patient has completed their intake form'
            });
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for notifications
    const notificationsChannel = supabase
      .channel('dashboard-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notification_queue'
        },
        (payload) => {
          console.log('Notification change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(patientsChannel);
      supabase.removeChannel(intakeChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [queryClient, addNotification]);
};
