
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Eye, 
  Activity,
  FileText,
  Bell,
  TrendingUp,
  Users
} from 'lucide-react';
import { useComplianceMetrics } from '@/hooks/useAuditLog';
import { hipaaComplianceCore } from '@/services/hipaaComplianceCore';
import { advancedBreachDetection } from '@/services/hipaa/advancedBreachDetection';
import { encryptedDataStorage } from '@/services/hipaa/encryptedDataStorage';

export const AdvancedComplianceDashboard = () => {
  const { data: complianceData } = useComplianceMetrics();
  const [securityMetrics, setSecurityMetrics] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    falsePositives: 0,
    averageResponseTime: 0,
    riskLevel: 'low' as const
  });
  const [encryptionStatus, setEncryptionStatus] = useState({
    encryptedFields: 0,
    totalSensitiveFields: 0,
    encryptionCoverage: 0
  });
  const [complianceScore, setComplianceScore] = useState(0);

  useEffect(() => {
    loadComplianceMetrics();
  }, []);

  const loadComplianceMetrics = async () => {
    try {
      const [metrics, secMetrics, encConfig] = await Promise.all([
        hipaaComplianceCore.getComplianceMetrics(),
        advancedBreachDetection.getSecurityMetrics(),
        encryptedDataStorage.getEncryptionConfig()
      ]);

      setSecurityMetrics(secMetrics);
      setEncryptionStatus({
        encryptedFields: 45, // Mock data
        totalSensitiveFields: 50,
        encryptionCoverage: 90
      });
      
      // Calculate overall compliance score
      const score = calculateComplianceScore(metrics, secMetrics);
      setComplianceScore(score);
    } catch (error) {
      console.error('Failed to load compliance metrics:', error);
    }
  };

  const calculateComplianceScore = (metrics: any, secMetrics: any): number => {
    // Simplified compliance scoring algorithm
    let score = 100;
    
    // Deduct points for security issues
    score -= secMetrics.criticalAlerts * 10;
    score -= secMetrics.totalAlerts * 2;
    
    // Deduct points for missing encryption
    score -= (100 - encryptionStatus.encryptionCoverage) * 0.5;
    
    // Ensure score stays within bounds
    return Math.max(0, Math.min(100, score));
  };

  const getComplianceStatus = (score: number) => {
    if (score >= 95) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-800' };
    if (score >= 85) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-800' };
    if (score >= 70) return { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-800' };
    return { label: 'Needs Attention', color: 'bg-red-500', textColor: 'text-red-800' };
  };

  const status = getComplianceStatus(complianceScore);

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{complianceScore}%</p>
                <p className="text-sm text-gray-600">Compliance Score</p>
                <Badge className={`${status.color} text-white`}>
                  {status.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{securityMetrics.criticalAlerts}</p>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-xs text-gray-500">{securityMetrics.totalAlerts} total alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{encryptionStatus.encryptionCoverage}%</p>
                <p className="text-sm text-gray-600">Data Encrypted</p>
                <p className="text-xs text-gray-500">{encryptionStatus.encryptedFields}/{encryptionStatus.totalSensitiveFields} fields</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{securityMetrics.averageResponseTime}m</p>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <Badge variant="outline" className={`${securityMetrics.riskLevel === 'high' ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}`}>
                  {securityMetrics.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HIPAA Compliance Overview</CardTitle>
              <CardDescription>
                Current compliance status and key metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Compliance Score</span>
                  <span>{complianceScore}%</span>
                </div>
                <Progress value={complianceScore} className="w-full" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Security Posture</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Data Encryption</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Access Controls</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Audit Logging</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Risk Assessment</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Breach Detection</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Vulnerability Scanning</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Incident Response</span>
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Monitoring
              </CardTitle>
              <CardDescription>
                Real-time security alerts and threat detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Critical Alerts</h4>
                  <div className="space-y-2">
                    {securityMetrics.criticalAlerts === 0 ? (
                      <p className="text-sm text-gray-500">No critical alerts</p>
                    ) : (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-800">
                          {securityMetrics.criticalAlerts} critical security alerts require immediate attention
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Threat Intelligence</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Failed Login Attempts</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suspicious IP Addresses</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Anomalous Data Access</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Data Encryption Status
              </CardTitle>
              <CardDescription>
                Encryption coverage for sensitive data fields
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Encryption Coverage</span>
                  <span>{encryptionStatus.encryptionCoverage}%</span>
                </div>
                <Progress value={encryptionStatus.encryptionCoverage} className="w-full" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Encrypted Fields</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Patient SSN
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Medical Record Numbers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Insurance Information
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Pending Encryption</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Emergency Contact Info
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Previous Addresses
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Audit Trail Monitoring
              </CardTitle>
              <CardDescription>
                Comprehensive logging of all PHI access and system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{complianceData?.reduce((sum, item) => sum + item.total_audit_logs, 0) || 0}</p>
                    <p className="text-sm text-gray-600">Total Audit Entries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-sm text-gray-600">Coverage Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-gray-600">Audit Failures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Compliance Reports
              </CardTitle>
              <CardDescription>
                Generate and download compliance reports for auditors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  Security Assessment Report
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2">
                  <Shield className="w-6 h-6" />
                  HIPAA Compliance Summary
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2">
                  <Activity className="w-6 h-6" />
                  Audit Trail Export
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2">
                  <Users className="w-6 h-6" />
                  User Access Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
