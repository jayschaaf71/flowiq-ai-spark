
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Appointment {
  id: string;
  title: string;
  appointment_type: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "no-show";
  notes?: string;
  phone?: string;
  email?: string;
  created_at: string;
  patient_id: string;
  provider_id?: string;
}

export const useAppointments = () => {
  const { user } = useAuth();

  const { data: appointments = [], isLoading: loading, error } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      return data as Appointment[];
    },
    enabled: !!user?.id,
  });

  return {
    appointments,
    loading,
    error
  };
};
