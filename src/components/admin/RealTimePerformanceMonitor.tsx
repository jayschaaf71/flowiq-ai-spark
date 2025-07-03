import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Activity, 
  AlertTriangle, 
  Bell, 
  Database, 
  Network, 
  Server, 
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Settings
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

interface AlertThreshold {
  metricId: string;
  warningThreshold: number;
  criticalThreshold: number;
  enabled: boolean;
}

export const RealTimePerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      threshold: 80,
      status: 'optimal',
      trend: 'stable',
      icon: Server
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      threshold: 85,
      status: 'optimal',
      trend: 'up',
      icon: Activity
    },
    {
      id: 'database',
      name: 'Database Response',
      value: 23,
      unit: 'ms',
      threshold: 100,
      status: 'optimal',
      trend: 'down',
      icon: Database
    },
    {
      id: 'api',
      name: 'API Response Time',
      value: 156,
      unit: 'ms',
      threshold: 200,
      status: 'warning',
      trend: 'up',
      icon: Zap
    },
    {
      id: 'network',
      name: 'Network Latency',
      value: 34,
      unit: 'ms',
      threshold: 50,
      status: 'optimal',
      trend: 'stable',
      icon: Network
    }
  ]);

  const [alertThresholds, setAlertThresholds] = useState<AlertThreshold[]>([
    { metricId: 'cpu', warningThreshold: 70, criticalThreshold: 90, enabled: true },
    { metricId: 'memory', warningThreshold: 80, criticalThreshold: 95, enabled: true },
    { metricId: 'database', warningThreshold: 100, criticalThreshold: 200, enabled: true },
    { metricId: 'api', warningThreshold: 200, criticalThreshold: 500, enabled: true },
    { metricId: 'network', warningThreshold: 50, criticalThreshold: 100, enabled: true }
  ]);

  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const variance = (Math.random() - 0.5) * 10;
        const newValue = Math.max(0, metric.value + variance);
        
        const threshold = alertThresholds.find(t => t.metricId === metric.id);
        let status: 'optimal' | 'warning' | 'critical' = 'optimal';
        
        if (threshold) {
          if (newValue >= threshold.criticalThreshold) {
            status = 'critical';
          } else if (newValue >= threshold.warningThreshold) {
            status = 'warning';
          }
        }

        const trend = newValue > metric.value ? 'up' : newValue < metric.value ? 'down' : 'stable';

        return {
          ...metric,
          value: Math.round(newValue),
          status,
          trend
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [realTimeEnabled, alertThresholds]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'warning': return 'warning';
      default: return 'success';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-warning" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-success" />;
      default: return <div className="h-3 w-3" />;
    }
  };

  const criticalMetrics = metrics.filter(m => m.status === 'critical');
  const warningMetrics = metrics.filter(m => m.status === 'warning');

  return (
    <div className="space-y-6">
      {/* Real-time Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 h-5" />
            Real-Time Performance Monitoring
          </CardTitle>
          <CardDescription>
            Live system performance metrics with configurable alerts and thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="realtime"
                  checked={realTimeEnabled}
                  onCheckedChange={setRealTimeEnabled}
                />
                <Label htmlFor="realtime">Real-time Updates</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="alerts"
                  checked={alertsEnabled}
                  onCheckedChange={setAlertsEnabled}
                />
                <Label htmlFor="alerts">Performance Alerts</Label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={realTimeEnabled ? 'success' : 'secondary'}>
                {realTimeEnabled ? 'Live' : 'Paused'}
              </Badge>
              {realTimeEnabled && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Updating</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {alertsEnabled && (criticalMetrics.length > 0 || warningMetrics.length > 0) && (
        <div className="space-y-3">
          {criticalMetrics.map(metric => (
            <Alert key={metric.id} className="border-destructive bg-destructive/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>CRITICAL:</strong> {metric.name} is at {metric.value}{metric.unit} 
                (threshold: {alertThresholds.find(t => t.metricId === metric.id)?.criticalThreshold}{metric.unit})
                <Button variant="link" className="p-0 h-auto ml-2">
                  Investigate
                </Button>
              </AlertDescription>
            </Alert>
          ))}
          
          {warningMetrics.map(metric => (
            <Alert key={metric.id} className="border-warning bg-warning/10">
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>WARNING:</strong> {metric.name} is at {metric.value}{metric.unit}
                (threshold: {alertThresholds.find(t => t.metricId === metric.id)?.warningThreshold}{metric.unit})
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(metric => {
          const Icon = metric.icon;
          const threshold = alertThresholds.find(t => t.metricId === metric.id);
          const progressValue = threshold ? (metric.value / threshold.criticalThreshold) * 100 : 50;
          
          return (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trend)}
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}{metric.unit}</div>
                <Progress 
                  value={progressValue} 
                  className="mt-2"
                  // @ts-ignore
                  variant={getStatusColor(metric.status)}
                />
                <div className="flex items-center justify-between mt-2">
                  <Badge variant={getStatusColor(metric.status) as any}>
                    {metric.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Threshold: {threshold?.warningThreshold}{metric.unit}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Threshold Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Alert Thresholds Configuration
          </CardTitle>
          <CardDescription>
            Configure warning and critical thresholds for performance alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertThresholds.map(threshold => {
              const metric = metrics.find(m => m.id === threshold.metricId);
              if (!metric) return null;

              return (
                <div key={threshold.metricId} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{metric.name}</h4>
                    <p className="text-sm text-muted-foreground">Current: {metric.value}{metric.unit}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Warning</Label>
                      <Input
                        type="number"
                        value={threshold.warningThreshold}
                        onChange={(e) => {
                          const newThresholds = alertThresholds.map(t =>
                            t.metricId === threshold.metricId
                              ? { ...t, warningThreshold: Number(e.target.value) }
                              : t
                          );
                          setAlertThresholds(newThresholds);
                        }}
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Critical</Label>
                      <Input
                        type="number"
                        value={threshold.criticalThreshold}
                        onChange={(e) => {
                          const newThresholds = alertThresholds.map(t =>
                            t.metricId === threshold.metricId
                              ? { ...t, criticalThreshold: Number(e.target.value) }
                              : t
                          );
                          setAlertThresholds(newThresholds);
                        }}
                        className="w-20"
                      />
                    </div>
                    <Switch
                      checked={threshold.enabled}
                      onCheckedChange={(enabled) => {
                        const newThresholds = alertThresholds.map(t =>
                          t.metricId === threshold.metricId ? { ...t, enabled } : t
                        );
                        setAlertThresholds(newThresholds);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};