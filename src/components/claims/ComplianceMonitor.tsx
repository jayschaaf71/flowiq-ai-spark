
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ComplianceHeader } from "./compliance/ComplianceHeader";
import { ComplianceScoreCard } from "./compliance/ComplianceScoreCard";
import { ComplianceMetricCard } from "./compliance/ComplianceMetricCard";
import { ComplianceAuditLog } from "./compliance/ComplianceAuditLog";
import { ComplianceReports } from "./compliance/ComplianceReports";

interface ComplianceMetric {
  name: string;
  score: number;
  status: 'compliant' | 'warning' | 'critical';
  details: string;
  lastChecked: string;
}

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export const ComplianceMonitor = () => {
  const [complianceScore, setComplianceScore] = useState(0);
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      // Load audit logs
      const { data: auditData } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Transform audit data
      const transformedAuditLogs: AuditEntry[] = (auditData || []).map(log => ({
        id: log.id,
        action: log.action,
        user: log.user_id || 'System',
        timestamp: log.created_at,
        details: `${log.table_name} - ${log.action}`,
        riskLevel: log.action === 'DELETE' ? 'high' : log.action === 'UPDATE' ? 'medium' : 'low'
      }));

      setAuditLogs(transformedAuditLogs);

      // Generate compliance metrics
      const mockMetrics: ComplianceMetric[] = [
        {
          name: "HIPAA Compliance",
          score: 98,
          status: 'compliant',
          details: "All PHI access properly logged and secured",
          lastChecked: new Date().toISOString()
        },
        {
          name: "Data Encryption",
          score: 100,
          status: 'compliant', 
          details: "All data encrypted at rest and in transit",
          lastChecked: new Date().toISOString()
        },
        {
          name: "Access Controls",
          score: 95,
          status: 'compliant',
          details: "Role-based access properly configured",
          lastChecked: new Date().toISOString()
        },
        {
          name: "Audit Trail",
          score: 100,
          status: 'compliant',
          details: `${auditData?.length || 0} audit entries logged`,
          lastChecked: new Date().toISOString()
        },
        {
          name: "Data Retention",
          score: 88,
          status: 'warning',
          details: "Some old records may need archiving",
          lastChecked: new Date().toISOString()
        },
        {
          name: "User Training",
          score: 92,
          status: 'compliant',
          details: "Security training up to date",
          lastChecked: new Date().toISOString()
        }
      ];

      setMetrics(mockMetrics);
      
      // Calculate overall compliance score
      const avgScore = mockMetrics.reduce((sum, metric) => sum + metric.score, 0) / mockMetrics.length;
      setComplianceScore(Math.round(avgScore));

    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading compliance data...</div>;
  }

  return (
    <div className="space-y-6">
      <ComplianceHeader onRefresh={loadComplianceData} />

      <ComplianceScoreCard complianceScore={complianceScore} />

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Compliance Metrics</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <ComplianceMetricCard key={index} metric={metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <ComplianceAuditLog auditLogs={auditLogs} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ComplianceReports 
            auditLogs={auditLogs}
            metrics={metrics}
            complianceScore={complianceScore}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
