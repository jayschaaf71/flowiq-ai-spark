
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, AlertTriangle } from "lucide-react";

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ComplianceMetric {
  name: string;
  score: number;
  status: 'compliant' | 'warning' | 'critical';
  details: string;
  lastChecked: string;
}

interface ComplianceReportsProps {
  auditLogs: AuditEntry[];
  metrics: ComplianceMetric[];
  complianceScore: number;
}

export const ComplianceReports = ({ auditLogs, metrics, complianceScore }: ComplianceReportsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Audited Actions:</span>
              <span className="font-bold">{auditLogs.length}</span>
            </div>
            <div className="flex justify-between">
              <span>High Risk Events:</span>
              <span className="font-bold text-red-600">
                {auditLogs.filter(log => log.riskLevel === 'high').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Medium Risk Events:</span>
              <span className="font-bold text-yellow-600">
                {auditLogs.filter(log => log.riskLevel === 'medium').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Compliance Score:</span>
              <span className="font-bold text-green-600">{complianceScore}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                All systems operating within compliance parameters
              </AlertDescription>
            </Alert>
            
            {metrics.filter(m => m.status === 'warning').map((metric, index) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{metric.name}:</strong> {metric.details}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
