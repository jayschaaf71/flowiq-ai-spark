import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PlatformMetrics {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  systemUptime: number;
  totalRevenue: number;
  averageResponseTime: number;
  criticalAlerts: number;
  resourceUtilization: number;
}

interface SystemMetric {
  id: string;
  metric_type: string;
  metric_name: string;
  value: number;
  unit: string;
  status: string;
  recorded_at: string;
}

interface PlatformAlert {
  id: string;
  alert_type: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

export const usePlatformMetrics = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query for better data management
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_platform_stats');
      if (error) throw error;
      return data as unknown as PlatformMetrics;
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const { data: systemMetrics = [] } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as SystemMetric[];
    },
    refetchInterval: 60000,
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['platform-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as PlatformAlert[];
    },
    refetchInterval: 15000,
  });

  // Mutation to resolve alerts
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('platform_alerts')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          acknowledged_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', alertId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['platform-stats'] });
      toast({
        title: "Alert Resolved",
        description: "The alert has been successfully resolved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to resolve alert: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation to acknowledge alerts
  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('platform_alerts')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', alertId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-alerts'] });
      toast({
        title: "Alert Acknowledged",
        description: "The alert has been acknowledged.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to acknowledge alert: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const insertSampleMetrics = async () => {
    try {
      // Insert sample performance data
      const sampleMetrics = Array.from({ length: 24 }, (_, i) => ({
        response_time_ms: Math.floor(80 + Math.random() * 80),
        cpu_usage_percent: parseFloat((30 + Math.random() * 40).toFixed(2)),
        memory_usage_percent: parseFloat((40 + Math.random() * 30).toFixed(2)),
        database_connections: Math.floor(10 + Math.random() * 20),
        active_sessions: Math.floor(50 + Math.random() * 200),
        api_calls_count: Math.floor(1000 + Math.random() * 5000),
        error_rate_percent: parseFloat((Math.random() * 2).toFixed(2)),
        recorded_at: new Date(Date.now() - (i * 60 * 60 * 1000)).toISOString(),
      }));

      const { error: perfError } = await supabase
        .from('platform_performance')
        .insert(sampleMetrics);

      if (perfError) throw perfError;

      // Insert some sample alerts
      const sampleAlerts = [
        {
          title: 'High CPU Usage Detected',
          message: 'CPU usage has exceeded 80% for the past 10 minutes',
          severity: 'warning' as const,
          alert_type: 'performance',
          status: 'active' as const,
        },
        {
          title: 'Database Connection Spike',
          message: 'Unusual spike in database connections detected',
          severity: 'critical' as const,
          alert_type: 'database',
          status: 'active' as const,
        },
        {
          title: 'API Rate Limit Exceeded',
          message: 'Several tenants are approaching API rate limits',
          severity: 'medium' as const,
          alert_type: 'api',
          status: 'resolved' as const,
          resolved_at: new Date().toISOString(),
        },
      ];

      const { error: alertError } = await supabase
        .from('platform_alerts')
        .insert(sampleAlerts);

      if (alertError) throw alertError;

      // Refresh all queries
      queryClient.invalidateQueries({ queryKey: ['platform-stats'] });
      queryClient.invalidateQueries({ queryKey: ['platform-alerts'] });

      toast({
        title: "Sample Data Created",
        description: "Sample metrics and alerts have been inserted.",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to insert sample data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return {
    metrics,
    systemMetrics,
    alerts,
    loading: isLoading,
    error: error?.message,
    resolveAlert: resolveAlertMutation.mutate,
    acknowledgeAlert: acknowledgeAlertMutation.mutate,
    insertSampleMetrics,
    isResolvingAlert: resolveAlertMutation.isPending,
    isAcknowledgingAlert: acknowledgeAlertMutation.isPending,
  };
};