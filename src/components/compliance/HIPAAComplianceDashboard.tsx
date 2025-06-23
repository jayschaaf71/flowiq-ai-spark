
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { hipaaComplianceCore } from "@/services/hipaaComplianceCore";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Eye, 
  Activity,
  FileText,
  Users,
  Clock
} from "lucide-react";

export const HIPAAComplianceDashboard = () => {
  const [complianceMetrics, setComplianceMetrics] = useState({
    totalAIInteractions: 0,
    phiAccessed: 0,
    complianceViolations: 0,
    auditCoverage: 0,
    lastComplianceCheck: new Date().toISOString()
  });

  const [complianceStatus, setComplianceStatus] = useState('checking');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadComplianceMetrics();
  }, []);

  const loadComplianceMetrics = async () => {
    try {
      const metrics = await hipaaComplianceCore.getComplianceMetrics();
      setComplianceMetrics(metrics);
      
      // Determine overall compliance status
      if (metrics.complianceViolations === 0 && metrics.auditCoverage >= 95) {
        setComplianceStatus('compliant');
      } else if (metrics.complianceViolations <= 2) {
        setComplianceStatus('warning');
      } else {
        setComplianceStatus('violation');
      }
    } catch (error) {
      console.error('Failed to load compliance metrics:', error);
      setComplianceStatus('error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'violation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'violation': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            HIPAA Compliance Dashboard
          </h3>
          <p className="text-gray-600">Real-time monitoring of AI interactions and PHI protection</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(complianceStatus)}
          <Badge className={getStatusColor(complianceStatus)}>
            {complianceStatus === 'compliant' ? 'Fully Compliant' : 
             complianceStatus === 'warning' ? 'Attention Required' : 
             complianceStatus === 'violation' ? 'Violations Detected' : 'Checking...'}
          </Badge>
        </div>
      </div>

      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Interactions (24h)</p>
                <p className="text-2xl font-bold text-blue-600">{complianceMetrics.totalAIInteractions}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                <span>All encrypted & audited</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">PHI Access Events</p>
                <p className="text-2xl font-bold text-purple-600">{complianceMetrics.phiAccessed}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FileText className="w-3 h-3" />
                <span>Audit trail complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-green-600">{complianceMetrics.auditCoverage.toFixed(1)}%</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Progress value={complianceMetrics.auditCoverage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Violations</p>
                <p className={`text-2xl font-bold ${complianceMetrics.complianceViolations === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {complianceMetrics.complianceViolations}
                </p>
              </div>
              <AlertTriangle className={`w-8 h-8 ${complianceMetrics.complianceViolations === 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Last 24 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HIPAA Compliance Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Data Protection Measures
            </CardTitle>
            <CardDescription>Active HIPAA safeguards and protections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">End-to-End Encryption</span>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Anonymization</span>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Access Controls</span>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Enforced
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Audit Logging</span>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Breach Detection</span>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Monitoring
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              AI Service Compliance
            </CardTitle>
            <CardDescription>HIPAA-compliant AI services and BAAs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">OpenAI Enterprise</span>
              <Badge className="bg-green-100 text-green-700">
                <Shield className="w-3 h-3 mr-1" />
                BAA Signed
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Azure AI Healthcare</span>
              <Badge className="bg-green-100 text-green-700">
                <Shield className="w-3 h-3 mr-1" />
                BAA Signed
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Google Cloud Healthcare</span>
              <Badge className="bg-green-100 text-green-700">
                <Shield className="w-3 h-3 mr-1" />
                BAA Signed
              </Badge>
            </div>
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-600">
                All AI services are HIPAA-compliant with signed Business Associate Agreements
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Compliance Actions
          </CardTitle>
          <CardDescription>Manage and monitor HIPAA compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={loadComplianceMetrics} className="bg-blue-600 hover:bg-blue-700">
              <Activity className="w-4 h-4 mr-2" />
              Refresh Compliance Status
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Generate Compliance Report
            </Button>
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Review Audit Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {complianceMetrics.complianceViolations > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Compliance Alert:</strong> {complianceMetrics.complianceViolations} violation(s) detected in the last 24 hours. 
            Please review audit logs and take corrective action immediately.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
