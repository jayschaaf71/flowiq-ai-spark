import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Upload, 
  Download, 
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DSSETLStatus {
  status: 'idle' | 'configuring' | 'processing' | 'completed' | 'error';
  lastSync: string | null;
  recordsProcessed: number;
  errors: string[];
}

export default function DentalSleepSolutionsETL() {
  const [etlStatus, setEtlStatus] = useState<DSSETLStatus>({
    status: 'idle',
    lastSync: null,
    recordsProcessed: 0,
    errors: []
  });

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfigure = async () => {
    setIsConfiguring(true);
    setEtlStatus(prev => ({ ...prev, status: 'configuring' }));
    
    // Simulate configuration process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsConfiguring(false);
    setEtlStatus(prev => ({ ...prev, status: 'idle' }));
  };

  const handleStartETL = async () => {
    setIsProcessing(true);
    setEtlStatus(prev => ({ ...prev, status: 'processing' }));
    
    // Simulate ETL processing
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    setIsProcessing(false);
    setEtlStatus(prev => ({ 
      ...prev, 
      status: 'completed',
      lastSync: new Date().toISOString(),
      recordsProcessed: 1250
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'idle': 'bg-gray-100 text-gray-800',
      'configuring': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'error': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dental Sleep Solutions ETL</h1>
          <p className="text-gray-600">Configure and manage data integration from Dental Sleep Solutions</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleConfigure} 
            disabled={isConfiguring || isProcessing}
            variant="outline"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isConfiguring ? 'Configuring...' : 'Configure'}
          </Button>
          <Button 
            onClick={handleStartETL} 
            disabled={isConfiguring || isProcessing || etlStatus.status === 'idle'}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start ETL
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(etlStatus.status)}
            ETL Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getStatusBadge(etlStatus.status)}
              </div>
              <div className="text-sm text-gray-600">Current Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {etlStatus.recordsProcessed.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Records Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {etlStatus.lastSync ? new Date(etlStatus.lastSync).toLocaleDateString() : 'Never'}
              </div>
              <div className="text-sm text-gray-600">Last Sync</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">Database Connection</div>
                <div className="text-sm text-gray-600">Configure connection to Dental Sleep Solutions database</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Complete</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">Data Mapping</div>
                <div className="text-sm text-gray-600">Map Dental Sleep Solutions fields to FlowIQ schema</div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">Schedule Setup</div>
                <div className="text-sm text-gray-600">Configure automated sync schedule</div>
              </div>
              <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Patient Records</div>
                  <div className="text-sm text-gray-600">Patient demographics and visit data</div>
                </div>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Billing Data</div>
                  <div className="text-sm text-gray-600">Claims, payments, and financial records</div>
                </div>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Treatment Plans</div>
                  <div className="text-sm text-gray-600">Device assignments and treatment protocols</div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Data Sync Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Schema Mapping</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Validation</span>
                  <span>90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium">Complete Data Mapping</div>
                <div className="text-sm text-gray-600">Map remaining fields and validate data types</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium">Set Up Automated Sync</div>
                <div className="text-sm text-gray-600">Configure daily sync schedule for real-time data</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium">Integrate with FlowIQ Features</div>
                <div className="text-sm text-gray-600">Connect data to revenue tracking and patient management</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
