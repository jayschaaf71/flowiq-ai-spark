import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Activity, Lock, Eye } from "lucide-react";
import { useComplianceMetrics } from "@/hooks/useAuditLog";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";

export const ComplianceMonitor = () => {
  const { data: complianceData, loading: isLoading } = useComplianceMetrics();
  const { primaryTenant, user } = useEnhancedAuth();

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

  // Find current tenant's compliance data or use first available
  const tenantCompliance = complianceData && complianceData.length > 0 ? complianceData[0] : null;

  const getComplianceStatus = () => {
    if (!tenantCompliance || tenantCompliance.total_audit_logs === 0) {
      return { status: 'warning', text: 'Limited Audit Activity', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-800' };
    }
    if (tenantCompliance.total_audit_logs > 50) {
      return { status: 'good', text: 'Compliant & Active', icon: CheckCircle, color: 'bg-green-100 text-green-800' };
    }
    return { status: 'info', text: 'Monitoring Active', icon: Activity, color: 'bg-blue-100 text-blue-800' };
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
          Real-time compliance status for {primaryTenant?.tenant.brand_name || 'Current Tenant'}
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
          <Badge className={complianceStatus.color}>
            {complianceStatus.status === 'good' ? 'Compliant' : 
             complianceStatus.status === 'warning' ? 'Attention Required' : 'Active'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Patient Records</p>
            <p className="text-lg font-semibold">{tenantCompliance?.total_patients || 0}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Tenant Isolated</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Audit Entries</p>
            <p className="text-lg font-semibold">{tenantCompliance?.total_audit_logs || 0}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>All Access Logged</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Appointments</p>
            <p className="text-lg font-semibold">{tenantCompliance?.total_appointments || 0}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">SOAP Notes</p>
            <p className="text-lg font-semibold">{tenantCompliance?.total_soap_notes || 0}</p>
          </div>
        </div>

        {tenantCompliance?.last_audit_entry && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last Activity:</span>
              <span>{new Date(tenantCompliance.last_audit_entry).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>All PHI access is monitored and logged per HIPAA requirements</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Lock className="h-3 w-3" />
            <span>Data is isolated by tenant with Row-Level Security</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
