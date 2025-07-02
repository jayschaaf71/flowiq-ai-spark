import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's appointments - simplified query
      const { data: todaysAppointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', today)
        .neq('status', 'cancelled');

      // Get new patients this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: newPatients } = await supabase
        .from('patients')
        .select('*')
        .gte('created_at', weekAgo.toISOString());

      // Get today's revenue - check if table exists first
      const { data: todaysPayments } = await supabase
        .from('payment_records')
        .select('amount')
        .gte('payment_date', today)
        .eq('payment_status', 'completed');

      // Get recent patients
      const { data: recentPatients } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const todaysRevenue = todaysPayments?.reduce((sum, payment) => 
        sum + parseFloat(String(payment.amount || 0)), 0) || 0;

      return {
        appointmentsToday: todaysAppointments?.length || 0,
        newPatientsThisWeek: newPatients?.length || 0,
        todaysRevenue: todaysRevenue,
        recentPatients: recentPatients || [],
        todaysAppointments: todaysAppointments || []
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
    retry: false, // Don't retry on error
  });
};