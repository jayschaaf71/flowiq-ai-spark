
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Calendar } from "lucide-react";

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ComplianceAuditLogProps {
  auditLogs: AuditEntry[];
}

export const ComplianceAuditLog = ({ auditLogs }: ComplianceAuditLogProps) => {
  const getRiskBadge = (risk: string) => {
    const variants = {
      low: "outline",
      medium: "secondary",
      high: "destructive"
    } as const;
    
    return <Badge variant={variants[risk as keyof typeof variants]}>{risk} risk</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Recent Audit Activity
        </CardTitle>
        <CardDescription>
          Detailed log of all system access and data modifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {auditLogs.slice(0, 10).map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{log.action}</span>
                  {getRiskBadge(log.riskLevel)}
                </div>
                <p className="text-sm text-gray-600">{log.details}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {log.user}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
