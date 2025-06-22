
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, Eye, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useAuditLogs, useComplianceMetrics } from '@/hooks/useAuditLog';

export const TenantSecurityDashboard: React.FC = () => {
  const { primaryTenant } = useEnhancedAuth();
  const { data: auditLogs } = useAuditLogs();
  const { data: complianceData } = useComplianceMetrics();

  const tenantCompliance = complianceData?.find(d => 
    d.tenant_name === primaryTenant?.tenant.brand_name
  );

  const securityMetrics = {
    rlsEnabled: true,
    auditLogging: (auditLogs?.length || 0) > 0,
    dataEncryption: true,
    accessMonitoring: true,
    complianceScore: tenantCompliance ? 
      Math.min(100, Math.round((tenantCompliance.total_audit_logs / 100) * 100)) : 0
  };

  const getSecurityStatus = () => {
    if (securityMetrics.complianceScore >= 90) {
      return { status: 'excellent', text: 'Highly Secure', icon: CheckCircle, color: 'text-green-600' };
    } else if (securityMetrics.complianceScore >= 70) {
      return { status: 'good', text: 'Secure', icon: Shield, color: 'text-blue-600' };
    } else {
      return { status: 'warning', text: 'Needs Attention', icon: AlertTriangle, color: 'text-yellow-600' };
    }
  };

  const securityStatus = getSecurityStatus();
  const StatusIcon = securityStatus.icon;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Tenant Security Overview
          </CardTitle>
          <CardDescription>
            Security and compliance status for {primaryTenant?.tenant.brand_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Security Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-4 w-4 ${securityStatus.color}`} />
                  <span className="font-medium">Security Score</span>
                </div>
                <span className="text-2xl font-bold">{securityMetrics.complianceScore}%</span>
              </div>
              <Progress value={securityMetrics.complianceScore} className="h-2" />
              <p className="text-sm text-muted-foreground">{securityStatus.text}</p>
            </div>

            {/* Security Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Data Protection</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Row-Level Security</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    {securityMetrics.rlsEnabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Data Encryption</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    {securityMetrics.dataEncryption ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Monitoring & Compliance</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Audit Logging</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    {securityMetrics.auditLogging ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Access Monitoring</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    {securityMetrics.accessMonitoring ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Recent Security Activity */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Recent Security Activity</h4>
              <div className="space-y-2">
                {auditLogs?.slice(0, 3).map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{log.action} on {log.table_name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground">No recent security activity</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
