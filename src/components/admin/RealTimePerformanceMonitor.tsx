import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Cpu, Database, Network, Users, Zap, Loader } from 'lucide-react';
import { usePlatformMetrics } from '@/hooks/usePlatformMetrics';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface PerformanceData {
  id: string;
  response_time_ms: number;
  cpu_usage_percent: number;
  memory_usage_percent: number;
  database_connections: number;
  active_sessions: number;
  api_calls_count: number;
  error_rate_percent: number;
  recorded_at: string;
}

export const RealTimePerformanceMonitor = () => {
  const { metrics } = usePlatformMetrics();

  // Fetch performance data (last 24 hours)
  const { data: performanceData } = useQuery({
    queryKey: ['platform-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_performance')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: true });
      
      if (error) throw error;
      return data as PerformanceData[];
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (!performanceData || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin" />
          <span>Loading performance data...</span>
        </div>
      </div>
    );
  }

  const latestMetrics = performanceData[performanceData.length - 1];

  const chartData = performanceData.slice(-24).map((data) => ({
    time: format(new Date(data.recorded_at), 'HH:mm'),
    responseTime: data.response_time_ms,
    cpuUsage: data.cpu_usage_percent,
    memoryUsage: data.memory_usage_percent,
    activeSessions: data.active_sessions,
    apiCalls: data.api_calls_count,
    errorRate: data.error_rate_percent,
  }));

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'destructive';
    if (value >= thresholds.warning) return 'secondary';
    return 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Performance Monitor</h2>
          <p className="text-muted-foreground">Live system performance metrics and resource utilization</p>
        </div>
        <Badge variant="outline" className="font-mono">
          Updated: {format(new Date(latestMetrics.recorded_at), 'HH:mm:ss')}
        </Badge>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{latestMetrics.response_time_ms}ms</div>
            <Badge variant={getStatusColor(latestMetrics.response_time_ms, { warning: 200, critical: 500 })} className="text-xs">
              {latestMetrics.response_time_ms < 200 ? 'Good' : latestMetrics.response_time_ms < 500 ? 'Warning' : 'Critical'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{latestMetrics.cpu_usage_percent}%</div>
            <Progress value={latestMetrics.cpu_usage_percent} className="mt-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{latestMetrics.memory_usage_percent}%</div>
            <Progress value={latestMetrics.memory_usage_percent} className="mt-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">DB Connections</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{latestMetrics.database_connections}</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{latestMetrics.active_sessions}</div>
            <p className="text-xs text-muted-foreground">Current users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Error Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{latestMetrics.error_rate_percent}%</div>
            <Badge variant={getStatusColor(latestMetrics.error_rate_percent, { warning: 1, critical: 5 })} className="text-xs">
              {latestMetrics.error_rate_percent < 1 ? 'Good' : latestMetrics.error_rate_percent < 5 ? 'Warning' : 'Critical'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value) => [`${value}ms`, 'Response Time']}
                />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resource Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value, name) => [`${value}%`, name === 'cpuUsage' ? 'CPU' : 'Memory']}
                />
                <Area 
                  type="monotone" 
                  dataKey="cpuUsage" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="memoryUsage" 
                  stackId="1"
                  stroke="hsl(var(--secondary))" 
                  fill="hsl(var(--secondary))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* API Calls Chart */}
        <Card>
          <CardHeader>
            <CardTitle>API Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value) => [value, 'API Calls/Hour']}
                />
                <Line 
                  type="monotone" 
                  dataKey="apiCalls" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Active Sessions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value) => [value, 'Active Sessions']}
                />
                <Area 
                  type="monotone" 
                  dataKey="activeSessions" 
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};