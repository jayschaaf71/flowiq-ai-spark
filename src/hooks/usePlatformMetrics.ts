import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  severity: string;
  status: string;
  created_at: string;
}

export const usePlatformMetrics = () => {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [alerts, setAlerts] = useState<PlatformAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlatformMetrics = async () => {
    try {
      // Fetch tenant counts
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('id, is_active');

      if (tenantError) throw tenantError;

      const totalTenants = tenantData?.length || 0;
      const activeTenants = tenantData?.filter(t => t.is_active).length || 0;

      // Fetch user count
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id');

      if (userError) throw userError;

      const totalUsers = userData?.length || 0;

      // Fetch recent system metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (metricsError) throw metricsError;

      setSystemMetrics(metricsData || []);

      // Calculate average response time from API metrics
      const apiMetrics = metricsData?.filter(m => m.metric_type === 'api') || [];
      const avgResponseTime = apiMetrics.length > 0 
        ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length 
        : 142; // fallback value

      // Fetch active alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('platform_alerts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (alertsError) throw alertsError;

      setAlerts(alertsData || []);

      const criticalAlerts = alertsData?.filter(a => a.severity === 'critical').length || 0;

      // Calculate resource utilization (simplified)
      const cpuMetrics = metricsData?.filter(m => m.metric_type === 'cpu') || [];
      const avgCpuUsage = cpuMetrics.length > 0 
        ? cpuMetrics.reduce((sum, m) => sum + m.value, 0) / cpuMetrics.length 
        : 73; // fallback value

      setMetrics({
        totalTenants,
        activeTenants,
        totalUsers,
        systemUptime: 99.97, // This would come from uptime monitoring service
        totalRevenue: 284750, // This would come from billing/payment system
        averageResponseTime: Math.round(avgResponseTime),
        criticalAlerts,
        resourceUtilization: Math.round(avgCpuUsage)
      });

    } catch (err) {
      console.error('Error fetching platform metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  const insertSampleMetrics = async () => {
    try {
      // Insert some sample metrics for demonstration
      const sampleMetrics = [
        { metric_type: 'cpu', metric_name: 'CPU Usage', value: 45, unit: '%', threshold_warning: 70, threshold_critical: 90 },
        { metric_type: 'memory', metric_name: 'Memory Usage', value: 68, unit: '%', threshold_warning: 80, threshold_critical: 95 },
        { metric_type: 'database', metric_name: 'Database Response', value: 23, unit: 'ms', threshold_warning: 100, threshold_critical: 200 },
        { metric_type: 'api', metric_name: 'API Response Time', value: 156, unit: 'ms', threshold_warning: 200, threshold_critical: 500 },
        { metric_type: 'network', metric_name: 'Network Latency', value: 34, unit: 'ms', threshold_warning: 50, threshold_critical: 100 }
      ];

      const { error } = await supabase
        .from('system_metrics')
        .insert(sampleMetrics);

      if (error) throw error;

      // Insert sample alert
      const { error: alertError } = await supabase
        .from('platform_alerts')
        .insert({
          alert_type: 'performance',
          title: 'High API Response Time',
          message: 'API response time is above normal threshold',
          severity: 'warning'
        });

      if (alertError) throw alertError;

      // Refresh metrics
      fetchPlatformMetrics();
    } catch (err) {
      console.error('Error inserting sample metrics:', err);
    }
  };

  useEffect(() => {
    fetchPlatformMetrics();

    // Set up real-time updates
    const metricsChannel = supabase
      .channel('platform-metrics-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_metrics'
      }, () => {
        fetchPlatformMetrics();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'platform_alerts'
      }, () => {
        fetchPlatformMetrics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(metricsChannel);
    };
  }, []);

  return {
    metrics,
    systemMetrics,
    alerts,
    loading,
    error,
    refreshMetrics: fetchPlatformMetrics,
    insertSampleMetrics
  };
};