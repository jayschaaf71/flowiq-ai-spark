
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useDashboardData = () => {
  const { profile } = useAuth();

  // Financial metrics
  const { data: financialMetrics, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ['dashboard-financial', profile?.id],
    queryFn: async () => {
      // Mock data for now - would connect to real financial data
      return {
        todaysCollections: 8450,
        claimsPending: 23,
        collectionRate: 94.8,
        arDays: 18.2,
        trend: {
          collections: '+12%',
          claims: '3 high priority',
          rate: '+2.1%',
          ar: '-3.2 days'
        }
      };
    },
    enabled: !!profile?.id,
  });

  // Patient experience metrics
  const { data: patientMetrics, isLoading: isLoadingPatient } = useQuery({
    queryKey: ['dashboard-patient', profile?.id],
    queryFn: async () => {
      // Mock data for now - would connect to real patient data
      return {
        satisfactionScore: 4.8,
        responseTime: 2.3,
        portalUsage: 89,
        noShows: 3.2
      };
    },
    enabled: !!profile?.id,
  });

  // Compliance metrics
  const { data: complianceMetrics, isLoading: isLoadingCompliance } = useQuery({
    queryKey: ['dashboard-compliance', profile?.id],
    queryFn: async () => {
      // Mock data for now - would connect to real compliance data
      return {
        hipaaCompliance: 98,
        securityAudit: 94,
        dataBackup: 100,
        accessControls: 91
      };
    },
    enabled: !!profile?.id,
  });

  // Recent activity across all areas
  const { data: recentActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['dashboard-activity', profile?.id],
    queryFn: async () => {
      // This would aggregate activity from multiple tables
      return [
        { action: "Patient check-in automated", time: "2 min ago", status: "success", type: "patient" },
        { action: "SOAP note generated", time: "5 min ago", status: "success", type: "clinical" },
        { action: "Appointment reminder sent", time: "10 min ago", status: "success", type: "scheduling" },
        { action: "Claims submitted", time: "15 min ago", status: "pending", type: "financial" },
        { action: "Insurance verification completed", time: "20 min ago", status: "success", type: "financial" },
        { action: "Compliance audit completed", time: "25 min ago", status: "success", type: "compliance" }
      ];
    },
    enabled: !!profile?.id,
  });

  return {
    financialMetrics,
    patientMetrics,
    complianceMetrics,
    recentActivity,
    isLoading: isLoadingFinancial || isLoadingPatient || isLoadingCompliance || isLoadingActivity
  };
};
