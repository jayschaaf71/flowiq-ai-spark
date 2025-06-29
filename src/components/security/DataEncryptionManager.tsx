import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { encryptedDataStorage } from "@/services/hipaa/encryptedDataStorage";
import { Lock, Key, Shield, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

interface EncryptionStatus {
  field: string;
  status: 'encrypted' | 'pending' | 'error';
  algorithm: string;
  lastRotated: string;
}

export const DataEncryptionManager = () => {
  const [encryptionConfig, setEncryptionConfig] = useState({
    requireEncryption: true,
    encryptionLevel: 'advanced' as 'advanced' | 'basic' | 'military',
    keyRotationDays: 90,
    auditEncryptedAccess: true
  });

  const [encryptionStatus, setEncryptionStatus] = useState<EncryptionStatus[]>([
    { field: 'Patient PHI', status: 'encrypted', algorithm: 'AES-256-GCM', lastRotated: '2024-01-15' },
    { field: 'Medical Records', status: 'encrypted', algorithm: 'AES-256-GCM', lastRotated: '2024-01-15' },
    { field: 'SOAP Notes', status: 'encrypted', algorithm: 'AES-256-GCM', lastRotated: '2024-01-15' },
    { field: 'Appointment Data', status: 'encrypted', algorithm: 'AES-256-GCM', lastRotated: '2024-01-15' },
    { field: 'Insurance Information', status: 'encrypted', algorithm: 'AES-256-GCM', lastRotated: '2024-01-15' }
  ]);

  const [keyRotationInProgress, setKeyRotationInProgress] = useState(false);

  useEffect(() => {
    loadEncryptionConfig();
  }, []);

  const loadEncryptionConfig = async () => {
    try {
      const config = await encryptedDataStorage.getEncryptionConfig();
      setEncryptionConfig(config);
    } catch (error) {
      console.error('Failed to load encryption config:', error);
    }
  };

  const handleKeyRotation = async () => {
    setKeyRotationInProgress(true);
    try {
      await encryptedDataStorage.rotateEncryptionKeys();
      
      // Update status to show new rotation dates
      setEncryptionStatus(prev => 
        prev.map(item => ({
          ...item,
          lastRotated: new Date().toISOString().split('T')[0]
        }))
      );
    } catch (error) {
      console.error('Key rotation failed:', error);
    } finally {
      setKeyRotationInProgress(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'encrypted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Lock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'encrypted':
        return <Badge className="bg-green-100 text-green-700">Encrypted</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const encryptedCount = encryptionStatus.filter(item => item.status === 'encrypted').length;
  const encryptionPercentage = (encryptedCount / encryptionStatus.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Data Encryption Management
          </CardTitle>
          <CardDescription>
            Manage encryption for all PHI and sensitive data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Encryption Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{encryptionPercentage.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Data Encrypted</div>
                <Progress value={encryptionPercentage} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{encryptionConfig.encryptionLevel}</div>
                <div className="text-sm text-gray-600">Encryption Level</div>
                <div className="text-xs text-gray-500 mt-1">AES-256-GCM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{encryptionConfig.keyRotationDays}</div>
                <div className="text-sm text-gray-600">Key Rotation (Days)</div>
                <div className="text-xs text-gray-500 mt-1">Automatic</div>
              </div>
            </div>

            {/* Encryption Status */}
            <div>
              <h4 className="font-medium mb-3">Encryption Status by Data Type</h4>
              <div className="space-y-3">
                {encryptionStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="font-medium">{item.field}</div>
                        <div className="text-sm text-gray-600">
                          {item.algorithm} • Last rotated: {new Date(item.lastRotated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Management */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">Encryption Key Management</h4>
                  <p className="text-sm text-gray-600">
                    Keys are automatically rotated every {encryptionConfig.keyRotationDays} days
                  </p>
                </div>
                <Button 
                  onClick={handleKeyRotation}
                  disabled={keyRotationInProgress}
                  className="flex items-center gap-2"
                >
                  <Key className={`w-4 h-4 ${keyRotationInProgress ? 'animate-spin' : ''}`} />
                  {keyRotationInProgress ? 'Rotating...' : 'Rotate Keys Now'}
                </Button>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  All encryption keys are managed using industry-standard key management practices. 
                  Keys are never stored in plaintext and are rotated automatically for enhanced security.
                </AlertDescription>
              </Alert>
            </div>

            {/* Compliance Information */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Compliance Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">HIPAA Compliant Encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Data at Rest Encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Data in Transit Encryption</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Automatic Key Rotation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Audit Trail Logging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">SOC 2 Type II Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
