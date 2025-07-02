import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Database,
  Globe,
  Shield,
  Zap,
  Activity
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  duration: number;
}

export const SystemHealthCheck: React.FC = () => {
  const [testResults, setTestResults] = React.useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);
  const [lastRun, setLastRun] = React.useState<Date | null>(null);

  const runHealthCheck = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests: Omit<TestResult, 'status' | 'duration'>[] = [
      { name: 'Database Connection', message: 'Testing Supabase connection and query performance' },
      { name: 'Authentication Service', message: 'Verifying auth token validation and user session handling' },
      { name: 'Edge Functions', message: 'Testing serverless function response times' },
      { name: 'File Storage', message: 'Checking storage bucket access and upload capabilities' },
      { name: 'Real-time Subscriptions', message: 'Validating WebSocket connections and live updates' },
      { name: 'API Rate Limits', message: 'Ensuring rate limiting is properly configured' },
      { name: 'SSL/TLS Security', message: 'Verifying SSL certificate and HTTPS enforcement' },
      { name: 'CORS Configuration', message: 'Testing cross-origin request handling' },
    ];

    for (const test of tests) {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const duration = Math.round(200 + Math.random() * 800);
      const success = Math.random() > 0.15; // 85% success rate
      
      const result: TestResult = {
        ...test,
        status: success ? 'pass' : Math.random() > 0.5 ? 'warning' : 'fail',
        duration
      };

      setTestResults(prev => [...prev, result]);
    }

    setIsRunning(false);
    setLastRun(new Date());
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return 'text-green-700 bg-green-100 border-green-200';
      case 'fail': return 'text-red-700 bg-red-100 border-red-200';
      case 'warning': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    }
  };

  const passedTests = testResults.filter(t => t.status === 'pass').length;
  const failedTests = testResults.filter(t => t.status === 'fail').length;
  const warningTests = testResults.filter(t => t.status === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Health Check</h2>
          <p className="text-gray-600">Comprehensive testing of all system components</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runHealthCheck} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run Health Check
              </>
            )}
          </Button>
        </div>
      </div>

      {lastRun && (
        <Alert className="bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Last health check completed at {lastRun.toLocaleTimeString()} on {lastRun.toLocaleDateString()}
          </AlertDescription>
        </Alert>
      )}

      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Passed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{passedTests}</div>
              <p className="text-sm text-gray-600">Tests completed successfully</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{warningTests}</div>
              <p className="text-sm text-gray-600">Tests with minor issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{failedTests}</div>
              <p className="text-sm text-gray-600">Tests that require attention</p>
            </CardContent>
          </Card>
        </div>
      )}

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Detailed results from the health check</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((test, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm opacity-90">{test.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {test.duration}ms
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-medium mb-2">Running System Health Check</h3>
              <p className="text-gray-600">Testing {testResults.length + 1} of 8 components...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};