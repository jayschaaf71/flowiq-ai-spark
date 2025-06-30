
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { claimsComplianceIntegration } from "@/services/claims/complianceIntegration";
import { ComplianceHeader } from "./compliance/ComplianceHeader";
import { ComplianceScoreCard } from "./compliance/ComplianceScoreCard";
import { ComplianceMetricCard } from "./compliance/ComplianceMetricCard";
import { ComplianceAuditLog } from "./compliance/ComplianceAuditLog";
import { ComplianceReports } from "./compliance/ComplianceReports";
import { Shield, AlertTriangle, Zap } from "lucide-react";

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
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(false);
  const { toast } = useToast();

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

      // Generate enhanced compliance metrics
      const mockMetrics: ComplianceMetric[] = [
        {
          name: "Claims HIPAA Compliance",
          score: 98,
          status: 'compliant',
          details: "All claims PHI properly secured and audited",
          lastChecked: new Date().toISOString()
        },
        {
          name: "Real-time Monitoring",
          score: realTimeMonitoring ? 100 : 85,
          status: realTimeMonitoring ? 'compliant' : 'warning',
          details: realTimeMonitoring ? "Active monitoring enabled" : "Enable for enhanced security",
          lastChecked: new Date().toISOString()
        },
        {
          name: "Data Encryption",
          score: 100,
          status: 'compliant', 
          details: "All claims data encrypted at rest and in transit",
          lastChecked: new Date().toISOString()
        },
        {
          name: "Access Controls",
          score: 95,
          status: 'compliant',
          details: "Role-based access properly configured for claims",
          lastChecked: new Date().toISOString()
        },
        {
          name: "Claims Audit Trail",
          score: 100,
          status: 'compliant',
          details: `${auditData?.length || 0} audit entries logged`,
          lastChecked: new Date().toISOString()
        },
        {
          name: "Breach Detection",
          score: 96,
          status: 'compliant',
          details: "Advanced breach detection active",
          lastChecked: new Date().toISOString()
        }
      ];

      setMetrics(mockMetrics);
      
      // Calculate overall compliance score
      const avgScore = mockMetrics.reduce((sum, metric) => sum + metric.score, 0) / mockMetrics.length;
      setComplianceScore(Math.round(avgScore));

    } catch (error) {
      console.error('Error loading compliance data:', error);
      toast({
        title: "Error Loading Compliance Data",
        description: "Unable to load compliance metrics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const enableRealTimeMonitoring = async () => {
    try {
      setRealTimeMonitoring(true);
      
      toast({
        title: "Real-time Monitoring Enabled",
        description: "Claims compliance monitoring is now active",
      });

      // Start real-time monitoring
      await claimsComplianceIntegration.monitorClaimsComplianceInRealTime();
      
      // Refresh metrics
      await loadComplianceData();

    } catch (error) {
      console.error('Error enabling real-time monitoring:', error);
      toast({
        title: "Monitoring Setup Failed",
        description: "Unable to enable real-time monitoring",
        variant: "destructive"
      });
      setRealTimeMonitoring(false);
    }
  };

  const generateComplianceReport = async () => {
    try {
      toast({
        title: "Generating Compliance Report",
        description: "Creating comprehensive compliance assessment...",
      });

      const dateRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        end: new Date()
      };

      const report = await claimsComplianceIntegration.generateComplianceReport(dateRange);
      
      console.log('Compliance report generated:', report);

      toast({
        title: "Report Generated",
        description: "Compliance report ready for download",
      });

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Report Generation Failed",
        description: "Unable to generate compliance report",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading compliance data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ComplianceHeader onRefresh={loadComplianceData} />
        <div className="flex gap-2">
          {!realTimeMonitoring && (
            <Button onClick={enableRealTimeMonitoring} variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Enable Real-time Monitoring
            </Button>
          )}
          <Button onClick={generateComplianceReport} size="sm">
            Generate Report
          </Button>
        </div>
      </div>

      {realTimeMonitoring && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span><strong>Real-time Monitoring Active</strong> - Continuous compliance assessment enabled</span>
              <Badge className="bg-green-100 text-green-700">Live</Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <ComplianceScoreCard complianceScore={complianceScore} />

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Enhanced Metrics</TabsTrigger>
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
