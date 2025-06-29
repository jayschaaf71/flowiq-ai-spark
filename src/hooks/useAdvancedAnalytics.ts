
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AnalyticsMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  activePatients: number;
  patientGrowth: number;
  totalAppointments: number;
  appointmentGrowth: number;
  efficiencyScore: number;
  collectionRate: number;
  noShowRate: number;
  avgWaitTime: number;
}

export interface RevenueAnalytics {
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    collections: number;
    charges: number;
  }>;
  payerMix: Array<{
    name: string;
    percentage: number;
    amount: number;
  }>;
  topProcedures: Array<{
    procedure: string;
    count: number;
    revenue: number;
  }>;
}

export interface PatientAnalytics {
  demographics: {
    ageGroups: Array<{ range: string; count: number }>;
    genderDistribution: Array<{ gender: string; count: number }>;
    insuranceTypes: Array<{ type: string; count: number }>;
  };
  satisfaction: {
    average: number;
    trend: number;
    responses: number;
  };
  retention: {
    rate: number;
    newPatients: number;
    returningPatients: number;
  };
}

export const useAdvancedAnalytics = (timeRange: string = '30days') => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [patientAnalytics, setPatientAnalytics] = useState<PatientAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Fetch basic metrics
      const [patientsRes, appointmentsRes, claimsRes] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact' }),
        supabase.from('appointments').select('*').gte('created_at', startDate.toISOString()),
        supabase.from('claims').select('*').gte('created_at', startDate.toISOString())
      ]);

      // Mock comprehensive analytics data
      const mockMetrics: AnalyticsMetrics = {
        totalRevenue: 127450,
        revenueGrowth: 12.5,
        activePatients: patientsRes.count || 2847,
        patientGrowth: 8.2,
        totalAppointments: appointmentsRes.data?.length || 1456,
        appointmentGrowth: 15.3,
        efficiencyScore: 94.2,
        collectionRate: 96.8,
        noShowRate: 4.2,
        avgWaitTime: 12.5
      };

      const mockRevenueAnalytics: RevenueAnalytics = {
        monthlyRevenue: [
          { month: 'Jan', revenue: 145000, collections: 138000, charges: 155000 },
          { month: 'Feb', revenue: 152000, collections: 144000, charges: 162000 },
          { month: 'Mar', revenue: 148000, collections: 141000, charges: 158000 },
          { month: 'Apr', revenue: 167000, collections: 159000, charges: 178000 },
          { month: 'May', revenue: 172000, collections: 164000, charges: 183000 },
          { month: 'Jun', revenue: 165000, collections: 157000, charges: 175000 }
        ],
        payerMix: [
          { name: 'Medicare', percentage: 35, amount: 57750 },
          { name: 'Medicaid', percentage: 25, amount: 41250 },
          { name: 'Commercial', percentage: 30, amount: 49500 },
          { name: 'Self-Pay', percentage: 10, amount: 16500 }
        ],
        topProcedures: [
          { procedure: 'Office Visit - Established', count: 245, revenue: 24500 },
          { procedure: 'Office Visit - New Patient', count: 156, revenue: 18720 },
          { procedure: 'Preventive Care', count: 189, revenue: 15120 },
          { procedure: 'Minor Procedure', count: 78, revenue: 11700 }
        ]
      };

      const mockPatientAnalytics: PatientAnalytics = {
        demographics: {
          ageGroups: [
            { range: '18-25', count: 234 },
            { range: '26-35', count: 567 },
            { range: '36-45', count: 789 },
            { range: '46-55', count: 645 },
            { range: '56+', count: 612 }
          ],
          genderDistribution: [
            { gender: 'Female', count: 1567 },
            { gender: 'Male', count: 1280 }
          ],
          insuranceTypes: [
            { type: 'Commercial', count: 1234 },
            { type: 'Medicare', count: 856 },
            { type: 'Medicaid', count: 534 },
            { type: 'Self-Pay', count: 223 }
          ]
        },
        satisfaction: {
          average: 4.7,
          trend: 0.3,
          responses: 1834
        },
        retention: {
          rate: 87.5,
          newPatients: 234,
          returningPatients: 1613
        }
      };

      setMetrics(mockMetrics);
      setRevenueAnalytics(mockRevenueAnalytics);
      setPatientAnalytics(mockPatientAnalytics);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error loading analytics",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  return {
    metrics,
    revenueAnalytics,
    patientAnalytics,
    loading,
    refetch: fetchAnalytics
  };
};
