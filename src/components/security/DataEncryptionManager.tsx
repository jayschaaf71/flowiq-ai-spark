
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lock, 
  Key, 
  Shield,
  Database,
  FileText,
  Server,
  Wifi,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface EncryptionStatus {
  component: string;
  status: 'encrypted' | 'unencrypted' | 'partial';
  algorithm: string;
  keyRotation: string;
  lastUpdated: string;
  recordCount?: number;
}

export const DataEncryptionManager: React.FC = () => {
  const [showKeys, setShowKeys] = useState(false);

  const [encryptionStatus] = useState<EncryptionStatus[]>([
    {
      component: 'Patient Records',
      status: 'encrypted',
      algorithm: 'AES-256',
      keyRotation: '90 days',
      lastUpdated: '2024-01-15',
      recordCount: 1247
    },
    {
      component: 'SOAP Notes',
      status: 'encrypted',
      algorithm: 'AES-256',
      keyRotation: '90 days',
      lastUpdated: '2024-01-15',
      recordCount: 3456
    },
    {
      component: 'Appointment Data',
      status: 'encrypted',
      algorithm: 'AES-256',
      keyRotation: '90 days',
      lastUpdated: '2024-01-15',
      recordCount: 892
    },
    {
      component: 'Billing Information',
      status: 'encrypted',
      algorithm: 'AES-256',
      keyRotation: '90 days',
      lastUpdated: '2024-01-15',
      recordCount: 567
    },
    {
      component: 'File Attachments',
      status: 'partial',
      algorithm: 'AES-256',
      keyRotation: '90 days',
      lastUpdated: '2024-01-10',
      recordCount: 234
    }
  ]);

  const encryptionMetrics = {
    totalRecords: 6396,
    encryptedRecords: 6162,
    encryptionRate: 96.3,
    keyRotationCompliance: 100,
    lastAudit: '2024-01-18'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'encrypted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'unencrypted': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'encrypted': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'unencrypted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lock className="h-8 w-8 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold">Data Encryption Manager</h2>
          <p className="text-gray-600">Manage encryption keys and data security</p>
        </div>
      </div>

      {/* Encryption Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{encryptionMetrics.encryptionRate}%</div>
              <div className="text-sm text-gray-600">Data Encrypted</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{encryptionMetrics.totalRecords.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{encryptionMetrics.keyRotationCompliance}%</div>
              <div className="text-sm text-gray-600">Key Rotation</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">AES-256</div>
              <div className="text-sm text-gray-600">Encryption Standard</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Encryption Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Encryption Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Data Encryption Progress</span>
                <span>{encryptionMetrics.encryptedRecords.toLocaleString()} / {encryptionMetrics.totalRecords.toLocaleString()} records</span>
              </div>
              <Progress value={encryptionMetrics.encryptionRate} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 border rounded-lg">
                <Database className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="font-medium">At Rest</div>
                <div className="text-sm text-green-600">Fully Encrypted</div>
              </div>
              
              <div className="text-center p-3 border rounded-lg">
                <Wifi className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="font-medium">In Transit</div>
                <div className="text-sm text-green-600">TLS 1.3</div>
              </div>
              
              <div className="text-center p-3 border rounded-lg">
                <Server className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="font-medium">In Processing</div>
                <div className="text-sm text-green-600">Secure Enclaves</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Encryption Status */}
      <Card>
        <CardHeader>
          <CardTitle>Component Encryption Status</CardTitle>
          <CardDescription>
            Detailed encryption status for each system component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {encryptionStatus.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.component}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Algorithm: {item.algorithm}</span>
                        <span>Records: {item.recordCount?.toLocaleString()}</span>
                        <span>Last Updated: {item.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Rotate Key
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Encryption Key Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Master Key</div>
                <div className="text-sm text-gray-600">
                  {showKeys ? 'mk_prod_a1b2c3d4e5f6g7h8i9j0' : '••••••••••••••••••••••••'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKeys(!showKeys)}
                >
                  {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rotate
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Database Encryption Key</div>
                <div className="text-sm text-gray-600">
                  {showKeys ? 'dek_prod_z9y8x7w6v5u4t3s2r1q0' : '••••••••••••••••••••••••'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rotate
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">File Storage Key</div>
                <div className="text-sm text-gray-600">
                  {showKeys ? 'fek_prod_p0o9i8u7y6t5r4e3w2q1' : '••••••••••••••••••••••••'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rotate
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Security Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">HIPAA Compliance</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SOC 2 Type II</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">GDPR Compliance</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Key Rotation Policy</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup Encryption</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Access Logging</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
