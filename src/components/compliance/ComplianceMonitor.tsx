
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { useComplianceMetrics } from "@/hooks/useAuditLog";
import { useAuth } from "@/hooks/useAuth";

export const ComplianceMonitor = () => {
  const { data: complianceData, isLoading } = useComplianceMetrics();
  const { profile } = useAuth();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            HIPAA Compliance Monitor
          </CardTitle>
          <CardDescription>Loading compliance metrics...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const patientRecords = complianceData?.find(d => d.table_name === 'patients');
  const auditLogs = complianceData?.find(d => d.table_name === 'audit_logs');

  const getComplianceStatus = () => {
    if (!auditLogs || auditLogs.recent_records === 0) {
      return { status: 'warning', text: 'Limited Recent Activity', icon: AlertTriangle };
    }
    if (auditLogs.total_records > 100) {
      return { status: 'good', text: 'Active Monitoring', icon: CheckCircle };
    }
    return { status: 'info', text: 'Monitoring Active', icon: Activity };
  };

  const complianceStatus = getComplianceStatus();
  const StatusIcon = complianceStatus.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          HIPAA Compliance Monitor
        </CardTitle>
        <CardDescription>
          Real-time compliance status for tenant: {profile?.tenant_id}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Overall Status</p>
            <div className="flex items-center gap-2">
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm">{complianceStatus.text}</span>
            </div>
          </div>
          <Badge 
            variant={complianceStatus.status === 'good' ? 'default' : 'secondary'}
            className={
              complianceStatus.status === 'good' ? 'bg-green-100 text-green-800' :
              complianceStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }
          >
            {complianceStatus.status === 'good' ? 'Compliant' : 
             complianceStatus.status === 'warning' ? 'Attention' : 'Active'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Patient Records</p>
            <p className="text-lg font-semibold">{patientRecords?.total_records || 0}</p>
            <p className="text-xs text-muted-foreground">
              {patientRecords?.recent_records || 0} recent
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Audit Entries</p>
            <p className="text-lg font-semibold">{auditLogs?.total_records || 0}</p>
            <p className="text-xs text-muted-foreground">
              {auditLogs?.recent_records || 0} recent
            </p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>All PHI access is monitored and logged per HIPAA requirements</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
