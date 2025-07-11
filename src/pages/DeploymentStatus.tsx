import React from 'react';
import { Layout } from '@/components/Layout';
import { HealthCheck } from '@/components/deployment/HealthCheck';
import { VersionInfo } from '@/components/deployment/VersionInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';
import { Badge } from '@/components/ui/badge';
import { Settings, Activity, Package } from 'lucide-react';

const DeploymentStatus = () => {
  const { isFeatureEnabled, loading } = useFeatureFlags();

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Deployment Status</h1>
            <p className="text-muted-foreground">
              Monitor system health, version information, and feature flags
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">System Operational</span>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Health Check Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <h2 className="text-xl font-semibold">System Health</h2>
            </div>
            <HealthCheck />
          </div>

          {/* Version Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Version Information</h2>
            </div>
            <VersionInfo />
          </div>

          {/* Feature Flags Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Feature Flags</h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Active Feature Flags</CardTitle>
                <CardDescription>
                  Current feature flag configuration and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading feature flags...</div>
                ) : (
                  <div className="grid gap-3">
                    {[
                      'new_ui_layout',
                      'advanced_analytics',
                      'beta_features',
                      'multi_tenant_dashboard',
                      'ai_enhancements'
                    ].map((flagKey) => (
                      <div key={flagKey} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{flagKey.replace(/_/g, ' ').toUpperCase()}</div>
                          <div className="text-sm text-muted-foreground">
                            Feature flag: {flagKey}
                          </div>
                        </div>
                        <Badge variant={isFeatureEnabled(flagKey) ? "default" : "secondary"}>
                          {isFeatureEnabled(flagKey) ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeploymentStatus;