
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      // Fetch basic dashboard data
      const [patientsResult, appointmentsResult] = await Promise.all([
        supabase.from('patients').select('id').limit(10),
        supabase.from('appointments').select('id, status').limit(20)
      ]);

      return {
        patients: patientsResult.data || [],
        appointments: appointmentsResult.data || [],
        stats: {
          totalPatients: patientsResult.data?.length || 0,
          todayAppointments: appointmentsResult.data?.filter(apt => apt.status === 'confirmed').length || 0
        }
      };
    },
  });

  return {
    data,
    isLoading,
    error
  };
};
