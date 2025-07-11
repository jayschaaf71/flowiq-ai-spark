import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Calendar, Package, Server } from 'lucide-react';
import { getDeploymentConfig, getEnvironmentConfig } from '@/utils/deploymentConfig';

export const VersionInfo: React.FC = () => {
  const config = getDeploymentConfig();
  const envConfig = getEnvironmentConfig();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getEnvironmentBadge = () => {
    switch (config.environment) {
      case 'production':
        return <Badge variant="default" className="bg-green-500">Production</Badge>;
      case 'staging':
        return <Badge variant="secondary" className="bg-yellow-500">Staging</Badge>;
      case 'development':
        return <Badge variant="outline">Development</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Application Version Information
        </CardTitle>
        <CardDescription>
          Current deployment and build information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">{config.version}</div>
                <div className="text-sm text-muted-foreground">Version</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Server className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">{getEnvironmentBadge()}</div>
                <div className="text-sm text-muted-foreground">Environment</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold text-sm">{formatDate(config.buildDate)}</div>
                <div className="text-sm text-muted-foreground">Build Date</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <GitBranch className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold text-sm font-mono">
                  {config.gitHash?.substring(0, 8) || 'unknown'}
                </div>
                <div className="text-sm text-muted-foreground">Git Hash</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Feature Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Debug Mode</span>
                <Badge variant={envConfig.showDebugInfo ? "default" : "secondary"}>
                  {envConfig.showDebugInfo ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Analytics</span>
                <Badge variant={envConfig.enableAnalytics ? "default" : "secondary"}>
                  {envConfig.enableAnalytics ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Maintenance</span>
                <Badge variant={envConfig.maintenanceMode ? "destructive" : "default"}>
                  {envConfig.maintenanceMode ? "Active" : "Normal"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">API Configuration</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Supabase URL</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {config.apis.supabaseUrl.replace('https://', '').replace('.supabase.co', '...')}
                </code>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">API Key Status</span>
                <Badge variant="default">Configured</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};