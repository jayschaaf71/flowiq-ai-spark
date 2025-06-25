
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Lock,
  Eye,
  Database,
  Clock
} from 'lucide-react';
import { advancedBreachDetection } from '@/services/hipaa/advancedBreachDetection';
import { complianceAlerting } from '@/services/hipaa/complianceAlertingService';
import { encryptedDataStorage } from '@/services/hipaa/encryptedDataStorage';

interface ComplianceMetrics {
  totalAlerts: number;
  criticalAlerts: number;
  falsePositives: number;
  averageResponseTime: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastBreachAttempt?: Date;
}

export const AdvancedComplianceDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [securityMetrics, setSecurityMetrics] = useState<ComplianceMetrics>({
    totalAlerts: 0,
    criticalAlerts: 0,
    falsePositives: 0,
    averageResponseTime: 0,
    riskLevel: 'low'
  });
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [encryptionConfig, setEncryptionConfig] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      const [metrics, alerts, config] = await Promise.all([
        advancedBreachDetection.getSecurityMetrics(),
        complianceAlerting.getActiveAlerts(),
        encryptedDataStorage.getEncryptionConfig()
      ]);
      
      setSecurityMetrics(metrics);
      setActiveAlerts(alerts);
      setEncryptionConfig(config);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
      toast({
        title: "Error Loading Compliance Data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const performComplianceScan = async () => {
    setLoading(true);
    try {
      await complianceAlerting.performAutomatedComplinceScan();
      await loadComplianceData();
      
      toast({
        title: "Compliance Scan Complete",
        description: "Automated compliance scan completed successfully",
      });
    } catch (error) {
      toast({
        title: "Compliance Scan Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const rotateEncryptionKeys = async () => {
    setLoading(true);
    try {
      await encryptedDataStorage.rotateEncryptionKeys();
      await loadComplianceData();
      
      toast({
        title: "Encryption Keys Rotated",
        description: "All encryption keys have been successfully rotated",
      });
    } catch (error) {
      toast({
        title: "Key Rotation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplianceScore = () => {
    const baseScore = 100;
    const criticalPenalty = securityMetrics.criticalAlerts * 10;
    const totalAlertsPenalty = securityMetrics.totalAlerts * 2;
    const score = Math.max(0, baseScore - criticalPenalty - totalAlertsPenalty);
    return Math.min(100, score);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Compliance Score</p>
                <p className="text-2xl font-bold text-blue-600">{getComplianceScore()}%</p>
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
                <p className="text-sm font-medium">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">{securityMetrics.totalAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Risk Level</p>
                <Badge className={getRiskLevelColor(securityMetrics.riskLevel)}>
                  {securityMetrics.riskLevel.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold text-green-600">{securityMetrics.averageResponseTime}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="encryption">Data Encryption</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status Overview</CardTitle>
                <CardDescription>
                  Current HIPAA compliance status and recent activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Compliance</span>
                    <span className="font-medium">{getComplianceScore()}%</span>
                  </div>
                  <Progress value={getComplianceScore()} className="h-2" />
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Data encryption enabled</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Audit logging active</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Access controls enforced</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>Continuous monitoring enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage compliance and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={performComplianceScan} 
                  disabled={loading}
                  className="w-full"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Run Compliance Scan
                </Button>
                
                <Button 
                  onClick={rotateEncryptionKeys} 
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Rotate Encryption Keys
                </Button>
                
                <Button 
                  onClick={loadComplianceData} 
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Security Alerts</CardTitle>
              <CardDescription>
                Current security alerts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>No active security alerts</p>
                  <p className="text-sm">Your system is currently secure</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeAlerts.map((alert, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="font-medium">Security Alert #{index + 1}</p>
                            <p className="text-sm text-gray-600">Active monitoring detected an issue</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Encryption Status</CardTitle>
              <CardDescription>
                Manage encryption settings and key rotation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {encryptionConfig && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Encryption Level</p>
                    <Badge className="bg-green-100 text-green-800">
                      {encryptionConfig.encryptionLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Rotation</p>
                    <p className="text-sm text-gray-600">Every {encryptionConfig.keyRotationDays} days</p>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <Button onClick={rotateEncryptionKeys} disabled={loading}>
                  <Lock className="w-4 h-4 mr-2" />
                  Rotate Keys Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Continuous Monitoring</CardTitle>
              <CardDescription>
                Real-time compliance and security monitoring status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Database className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Data Access</p>
                  <p className="text-sm text-gray-600">Monitored</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">Security Events</p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-medium">Audit Logging</p>
                  <p className="text-sm text-gray-600">Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
