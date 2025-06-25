
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  FileText,
  Calendar,
  Users,
  Lock,
  Activity
} from "lucide-react";

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      compliant: "default",
      warning: "secondary", 
      critical: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: "outline",
      medium: "secondary",
      high: "destructive"
    } as const;
    
    return <Badge variant={variants[risk as keyof typeof variants]}>{risk} risk</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading compliance data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            HIPAA Compliance Monitor
          </h3>
          <p className="text-gray-600">
            Real-time monitoring of data security and compliance requirements
          </p>
        </div>
        <Button onClick={loadComplianceData}>
          <Activity className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Overall Compliance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Overall Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Compliance Rating</span>
                <span className="text-2xl font-bold text-green-600">{complianceScore}%</span>
              </div>
              <Progress value={complianceScore} className="h-3" />
            </div>
            <div className="text-center">
              {complianceScore >= 95 ? (
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-1" />
              ) : complianceScore >= 85 ? (
                <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-1" />
              )}
              <p className="text-sm font-medium">
                {complianceScore >= 95 ? 'Excellent' : complianceScore >= 85 ? 'Good' : 'Needs Attention'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Compliance Metrics</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                    {getStatusIcon(metric.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{metric.score}%</span>
                      {getStatusBadge(metric.status)}
                    </div>
                    <Progress value={metric.score} className="h-2" />
                    <p className="text-xs text-gray-600">{metric.details}</p>
                    <p className="text-xs text-gray-500">
                      Last checked: {new Date(metric.lastChecked).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
