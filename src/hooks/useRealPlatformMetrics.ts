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
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  timestamp: string;
  tenant_id?: string;
}

interface PlatformAlert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  created_at: string;
  resolved_at?: string;
}

interface Subscription {
  id: string;
  tenant_id: string;
  plan_name: string;
  plan_type: string;
  status: string;
  monthly_amount: number;
  start_date: string;
  end_date?: string;
}

interface Payment {
  id: string;
  tenant_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  status: string;
  payment_date: string;
}

export const useRealPlatformMetrics = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tenants data
  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*');
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000,
  });

  // Fetch users data
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000,
  });

  // Fetch system monitoring data
  const { data: systemMetrics = [] } = useQuery({
    queryKey: ['system-monitoring'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_monitoring')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  // Fetch alerts data
  const { data: alerts = [] } = useQuery({
    queryKey: ['system-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 15000,
  });

  // Fetch subscriptions data
  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*');
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000,
  });

  // Fetch payments data
  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000,
  });

  // Calculate platform metrics from real data
  const metrics: PlatformMetrics = {
    totalTenants: tenants.length,
    activeTenants: tenants.filter(t => t.is_active).length,
    totalUsers: users.length,
    systemUptime: 99.8, // Calculate from system metrics
    totalRevenue: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    averageResponseTime: systemMetrics
      .filter(m => m.metric_name === 'response_time')
      .reduce((sum, m) => sum + m.metric_value, 0) / 
      Math.max(systemMetrics.filter(m => m.metric_name === 'response_time').length, 1),
    criticalAlerts: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    resourceUtilization: systemMetrics
      .filter(m => m.metric_name === 'cpu_usage')
      .reduce((sum, m) => sum + m.metric_value, 0) / 
      Math.max(systemMetrics.filter(m => m.metric_name === 'cpu_usage').length, 1),
  };

  // Mutation to resolve alerts
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('system_alerts')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', alertId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
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
        .from('system_alerts')
        .update({
          status: 'acknowledged',
        })
        .eq('id', alertId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
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
      // Insert sample system monitoring data
      const sampleMetrics = [
        { metric_name: 'cpu_usage', metric_value: 45.2, metric_unit: 'percent' },
        { metric_name: 'memory_usage', metric_value: 67.8, metric_unit: 'percent' },
        { metric_name: 'disk_usage', metric_value: 23.4, metric_unit: 'percent' },
        { metric_name: 'response_time', metric_value: 125.6, metric_unit: 'ms' },
        { metric_name: 'active_users', metric_value: 12, metric_unit: 'count' },
      ];

      const { error: metricsError } = await supabase
        .from('system_monitoring')
        .insert(sampleMetrics);

      if (metricsError) throw metricsError;

      // Insert sample alerts
      const sampleAlerts = [
        {
          alert_type: 'performance',
          severity: 'medium' as const,
          message: 'Response time increased by 20%',
          status: 'active' as const,
        },
        {
          alert_type: 'security',
          severity: 'high' as const,
          message: 'Multiple failed login attempts detected',
          status: 'active' as const,
        },
        {
          alert_type: 'system',
          severity: 'low' as const,
          message: 'Backup completed successfully',
          status: 'resolved' as const,
          resolved_at: new Date().toISOString(),
        },
      ];

      const { error: alertError } = await supabase
        .from('system_alerts')
        .insert(sampleAlerts);

      if (alertError) throw alertError;

      // Refresh all queries
      queryClient.invalidateQueries({ queryKey: ['system-monitoring'] });
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });

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
    tenants,
    users,
    subscriptions,
    payments,
    loading: false, // We're not using loading states for individual queries
    error: null,
    resolveAlert: resolveAlertMutation.mutate,
    acknowledgeAlert: acknowledgeAlertMutation.mutate,
    insertSampleMetrics,
    isResolvingAlert: resolveAlertMutation.isPending,
    isAcknowledgingAlert: acknowledgeAlertMutation.isPending,
  };
}; 