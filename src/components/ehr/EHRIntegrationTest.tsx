/**
 * EHR Integration Test Component
 * Tests EasyBIS and Dental REM integrations
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, XCircle, AlertCircle, Database, Users, Calendar } from 'lucide-react';
import { EHRIntegrationManager } from '@/services/ehr/EHRIntegrationManager';
import { EasyBISConfig } from '@/services/ehr/EasyBISIntegration';
import { DentalREMConfig } from '@/services/ehr/DentalREMIntegration';

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  timestamp: string;
}

export const EHRIntegrationTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [ehrManager, setEhrManager] = useState<EHRIntegrationManager | null>(null);

  // Mock configurations for testing
  const easyBISConfig: EasyBISConfig = {
    system: 'easybis',
    specialty: 'chiropractic',
    practiceId: 'west-county-spine',
    apiEndpoint: process.env.EASYBIS_API_ENDPOINT || 'https://api.easybis.com',
    apiKey: process.env.EASYBIS_API_KEY || 'mock-key'
  };

  const dentalREMConfig: DentalREMConfig = {
    system: 'dental-rem',
    specialty: 'dental-sleep',
    practiceId: 'midwest-dental-sleep',
    apiEndpoint: process.env.DENTAL_REM_API_ENDPOINT || 'https://api.dentalrem.com',
    apiKey: process.env.DENTAL_REM_API_KEY || 'mock-key'
  };

  const initializeEHRManager = () => {
    const manager = new EHRIntegrationManager();
    manager.initializeEasyBIS(easyBISConfig);
    manager.initializeDentalREM(dentalREMConfig);
    setEhrManager(manager);
    return manager;
  };

  const runConnectionTests = async () => {
    setIsLoading(true);
    const results: TestResult[] = [];
    
    try {
      const manager = ehrManager || initializeEHRManager();
      
      // Test EasyBIS connection
      try {
        const easyBISIntegration = manager.getEasyBISIntegration();
        if (easyBISIntegration) {
          const isConnected = await easyBISIntegration.testConnection();
          results.push({
            success: isConnected,
            message: isConnected ? 'EasyBIS connection successful' : 'EasyBIS connection failed',
            timestamp: new Date().toISOString(),
            error: isConnected ? undefined : 'Connection test failed'
          });
        }
      } catch (error: any) {
        results.push({
          success: false,
          message: 'EasyBIS connection test failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }

      // Test Dental REM connection
      try {
        const dentalREMIntegration = manager.getDentalREMIntegration();
        if (dentalREMIntegration) {
          const isConnected = await dentalREMIntegration.testConnection();
          results.push({
            success: isConnected,
            message: isConnected ? 'Dental REM connection successful' : 'Dental REM connection failed',
            timestamp: new Date().toISOString(),
            error: isConnected ? undefined : 'Connection test failed'
          });
        }
      } catch (error: any) {
        results.push({
          success: false,
          message: 'Dental REM connection test failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error: any) {
      results.push({
        success: false,
        message: 'EHR Manager initialization failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const runPatientSyncTests = async () => {
    setIsLoading(true);
    const results: TestResult[] = [];
    
    try {
      const manager = ehrManager || initializeEHRManager();
      const syncResults = await manager.syncAllPatients();
      
      syncResults.forEach(result => {
        results.push({
          success: result.success,
          message: `${result.practice} patient sync: ${result.success ? 'Success' : 'Failed'}`,
          data: result.data,
          error: result.error,
          timestamp: result.timestamp
        });
      });

    } catch (error: any) {
      results.push({
        success: false,
        message: 'Patient sync test failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const runAppointmentSyncTests = async () => {
    setIsLoading(true);
    const results: TestResult[] = [];
    
    try {
      const manager = ehrManager || initializeEHRManager();
      const syncResults = await manager.syncAllAppointments();
      
      syncResults.forEach(result => {
        results.push({
          success: result.success,
          message: `${result.practice} appointment sync: ${result.success ? 'Success' : 'Failed'}`,
          data: result.data,
          error: result.error,
          timestamp: result.timestamp
        });
      });

    } catch (error: any) {
      results.push({
        success: false,
        message: 'Appointment sync test failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getSuccessCount = () => testResults.filter(r => r.success).length;
  const getTotalCount = () => testResults.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            EHR Integration Testing
          </CardTitle>
          <CardDescription>
            Test EasyBIS and Dental REM integrations for pilot practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button 
              onClick={runConnectionTests} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Test Connections
            </Button>
            
            <Button 
              onClick={runPatientSyncTests} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
              Sync Patients
            </Button>
            
            <Button 
              onClick={runAppointmentSyncTests} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
              Sync Appointments
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={getSuccessCount() === getTotalCount() ? "default" : "destructive"}>
                    {getSuccessCount()}/{getTotalCount()} Tests Passed
                  </Badge>
                </div>
                <Button onClick={clearResults} variant="outline" size="sm">
                  Clear Results
                </Button>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Results</TabsTrigger>
                  <TabsTrigger value="success">Success</TabsTrigger>
                  <TabsTrigger value="failed">Failed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-2">
                  {testResults.map((result, index) => (
                    <Alert key={index} variant={result.success ? "default" : "destructive"}>
                                             <div className="flex items-center gap-2">
                         {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                         <span className="font-medium">{result.message}</span>
                       </div>
                      {result.error && (
                        <AlertDescription className="mt-2">
                          Error: {result.error}
                        </AlertDescription>
                      )}
                      {result.data && (
                        <AlertDescription className="mt-2">
                          Data: {JSON.stringify(result.data, null, 2)}
                        </AlertDescription>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </Alert>
                  ))}
                </TabsContent>

                <TabsContent value="success" className="space-y-2">
                  {testResults.filter(r => r.success).map((result, index) => (
                                         <Alert key={index} variant="default">
                       <CheckCircle className="h-4 w-4" />
                       <span className="font-medium">{result.message}</span>
                      {result.data && (
                        <AlertDescription className="mt-2">
                          Data: {JSON.stringify(result.data, null, 2)}
                        </AlertDescription>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </Alert>
                  ))}
                </TabsContent>

                <TabsContent value="failed" className="space-y-2">
                  {testResults.filter(r => !r.success).map((result, index) => (
                                         <Alert key={index} variant="destructive">
                       <XCircle className="h-4 w-4" />
                       <span className="font-medium">{result.message}</span>
                      {result.error && (
                        <AlertDescription className="mt-2">
                          Error: {result.error}
                        </AlertDescription>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </Alert>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {testResults.length === 0 && !isLoading && (
                         <Alert>
               <AlertCircle className="h-4 w-4" />
               <span className="font-medium">No test results</span>
              <AlertDescription>
                Run one of the tests above to see results. Make sure to configure your EHR API credentials first.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
          <CardDescription>Current EHR integration configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">EasyBIS (Chiropractic)</h4>
              <div className="text-sm space-y-1">
                <div>Practice: West County Spine & Joint</div>
                <div>API Endpoint: {easyBISConfig.apiEndpoint}</div>
                <div>API Key: {easyBISConfig.apiKey ? 'Configured' : 'Not configured'}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Dental REM (Dental Sleep)</h4>
              <div className="text-sm space-y-1">
                <div>Practice: Midwest Dental Sleep Medicine Institute</div>
                <div>API Endpoint: {dentalREMConfig.apiEndpoint}</div>
                <div>API Key: {dentalREMConfig.apiKey ? 'Configured' : 'Not configured'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 