import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getHealthCheckEndpoints, getDeploymentConfig } from '@/utils/deploymentConfig';

interface HealthStatus {
  service: string;
  status: 'healthy' | 'unhealthy' | 'warning';
  responseTime?: number;
  error?: string;
  lastChecked: Date;
}

export const HealthCheck: React.FC = () => {
  const [healthStatuses, setHealthStatuses] = useState<HealthStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const checkHealth = async () => {
    setIsChecking(true);
    const statuses: HealthStatus[] = [];
    const endpoints = getHealthCheckEndpoints();

    // Check Supabase API
    try {
      const startTime = Date.now();
      const { error } = await supabase.from('tenants').select('count').limit(1);
      const responseTime = Date.now() - startTime;
      
      statuses.push({
        service: 'Supabase API',
        status: error ? 'unhealthy' : 'healthy',
        responseTime,
        error: error?.message,
        lastChecked: new Date(),
      });
    } catch (error) {
      statuses.push({
        service: 'Supabase API',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date(),
      });
    }

    // Check Authentication
    try {
      const startTime = Date.now();
      const { data } = await supabase.auth.getSession();
      const responseTime = Date.now() - startTime;
      
      statuses.push({
        service: 'Authentication',
        status: 'healthy',
        responseTime,
        lastChecked: new Date(),
      });
    } catch (error) {
      statuses.push({
        service: 'Authentication',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date(),
      });
    }

    // Check Database Connectivity
    try {
      const startTime = Date.now();
      const { error } = await supabase.from('profiles').select('count').limit(1);
      const responseTime = Date.now() - startTime;
      
      statuses.push({
        service: 'Database',
        status: error ? 'unhealthy' : responseTime > 1000 ? 'warning' : 'healthy',
        responseTime,
        error: error?.message,
        lastChecked: new Date(),
      });
    } catch (error) {
      statuses.push({
        service: 'Database',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date(),
      });
    }

    setHealthStatuses(statuses);
    setLastUpdate(new Date());
    setIsChecking(false);
  };

  useEffect(() => {
    checkHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500">Warning</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>;
    }
  };

  const config = getDeploymentConfig();
  const overallStatus = healthStatuses.every(s => s.status === 'healthy') 
    ? 'healthy' 
    : healthStatuses.some(s => s.status === 'unhealthy') 
    ? 'unhealthy' 
    : 'warning';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(overallStatus)}
                System Health Status
              </CardTitle>
              <CardDescription>
                Real-time health monitoring for ChiropracticIQ Platform
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkHealth}
              disabled={isChecking}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{getStatusBadge(overallStatus)}</div>
                <div className="text-sm text-muted-foreground">Overall Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{config.version}</div>
                <div className="text-sm text-muted-foreground">Version</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{config.environment}</div>
                <div className="text-sm text-muted-foreground">Environment</div>
              </div>
            </div>

            <div className="space-y-3">
              {healthStatuses.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <div className="font-medium">{status.service}</div>
                      {status.error && (
                        <div className="text-sm text-red-500">{status.error}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(status.status)}
                    {status.responseTime && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {status.responseTime}ms
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-muted-foreground text-center pt-4 border-t">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};