import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface HealthCheck {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
}

export function EnvironmentCheck() {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    runHealthChecks();
  }, []);

  const runHealthChecks = async () => {
    setIsLoading(true);
    const results: HealthCheck[] = [];

    // Check environment detection
    const isDev = import.meta.env.DEV;
    const hostname = window.location.hostname;
    results.push({
      name: 'Environment Detection',
      status: 'success',
      message: `Running in ${isDev ? 'development' : 'production'} mode on ${hostname}`
    });

    // Check Supabase connection
    try {
      const { data, error } = await supabase.from('tenants').select('count', { count: 'exact', head: true });
      if (error) {
        results.push({
          name: 'Database Connection',
          status: 'error',
          message: `Database error: ${error.message}`
        });
      } else {
        results.push({
          name: 'Database Connection',
          status: 'success',
          message: `Connected successfully. Found ${data?.[0]?.count || 0} tenants`
        });
      }
    } catch (error) {
      results.push({
        name: 'Database Connection',
        status: 'error',
        message: `Connection failed: ${error}`
      });
    }

    // Check tenant configuration
    const subdomain = hostname.includes('lovableproject.com') ? null : (
      hostname.includes('localhost') || hostname.includes('127.0.0.1') ? null : hostname.split('.')[0]
    );
    if (subdomain) {
      try {
        const { data: tenant } = await supabase
          .from('tenants')
          .select('*')
          .eq('subdomain', subdomain)
          .maybeSingle();
        
        if (tenant) {
          results.push({
            name: 'Tenant Configuration',
            status: 'success',
            message: `Found tenant: ${tenant.name}`
          });
        } else {
          results.push({
            name: 'Tenant Configuration',
            status: 'warning',
            message: `No tenant found for subdomain: ${subdomain}`
          });
        }
      } catch (error) {
        results.push({
          name: 'Tenant Configuration',
          status: 'error',
          message: `Error checking tenant: ${error}`
        });
      }
    } else {
      results.push({
        name: 'Tenant Configuration',
        status: 'success',
        message: 'Using default configuration (no subdomain)'
      });
    }

    setChecks(results);
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Environment Health Check</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Running health checks...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Health Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              {getStatusIcon(check.status)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{check.name}</span>
                  <Badge className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{check.message}</p>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={runHealthChecks}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Run Checks Again
        </button>
      </CardContent>
    </Card>
  );
}