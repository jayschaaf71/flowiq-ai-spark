
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Play, 
  RefreshCw,
  Monitor,
  Shield,
  Zap
} from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'running';
  duration: number;
  details?: string;
}

interface QualityMetrics {
  testCoverage: number;
  performanceScore: number;
  accessibilityScore: number;
  securityScore: number;
}

export const QualityAssurance = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { id: '1', name: 'User Authentication', status: 'passed', duration: 145 },
    { id: '2', name: 'Patient Registration', status: 'passed', duration: 230 },
    { id: '3', name: 'Appointment Booking', status: 'warning', duration: 180, details: 'Slow response time' },
    { id: '4', name: 'EHR Data Access', status: 'passed', duration: 95 },
    { id: '5', name: 'Payment Processing', status: 'failed', duration: 0, details: 'Connection timeout' },
  ]);

  const qualityMetrics: QualityMetrics = {
    testCoverage: 87,
    performanceScore: 92,
    accessibilityScore: 95,
    securityScore: 88
  };

  const runTests = async () => {
    setIsRunning(true);
    
    // Simulate test execution
    const updatedResults = testResults.map(test => ({
      ...test,
      status: 'running' as const
    }));
    setTestResults(updatedResults);

    // Simulate individual test completions
    for (let i = 0; i < testResults.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestResults(prev => prev.map((test, index) => {
        if (index === i) {
          const outcomes = ['passed', 'failed', 'warning'] as const;
          return {
            ...test,
            status: outcomes[Math.floor(Math.random() * outcomes.length)],
            duration: Math.floor(Math.random() * 300) + 50
          };
        }
        return test;
      }));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'running':
        return 'bg-blue-100 text-blue-700';
    }
  };

  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quality Assurance Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor test results, performance metrics, and code quality
          </p>
        </div>
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="quality">Code Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Test Coverage</p>
                    <p className="text-2xl font-bold">{qualityMetrics.testCoverage}%</p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tests Passed</p>
                    <p className="text-2xl font-bold">{passedTests}/{totalTests}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Performance</p>
                    <p className="text-2xl font-bold">{qualityMetrics.performanceScore}</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Accessibility</p>
                    <p className="text-2xl font-bold">{qualityMetrics.accessibilityScore}</p>
                  </div>
                  <Monitor className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <p className="font-medium">{test.name}</p>
                        {test.details && (
                          <p className="text-sm text-muted-foreground">{test.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {test.status !== 'running' && (
                        <span className="text-sm text-muted-foreground">
                          {test.duration}ms
                        </span>
                      )}
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Load Time</span>
                    <span>1.2s</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>First Paint</span>
                    <span>0.8s</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Interactive</span>
                    <span>2.1s</span>
                  </div>
                  <Progress value={88} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Memory Usage</span>
                    <span>45.2 MB</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Bundle Size</span>
                    <span>2.1 MB</span>
                  </div>
                  <Progress value={68} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>API Calls</span>
                    <span>12/min</span>
                  </div>
                  <Progress value={45} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Maintainability</span>
                    <span>A</span>
                  </div>
                  <Progress value={95} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Reliability</span>
                    <span>A</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Security</span>
                    <span>B</span>
                  </div>
                  <Progress value={88} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical Debt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">2.5h</p>
                  <p className="text-sm text-muted-foreground">Estimated debt</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Code Smells</span>
                    <span>5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duplications</span>
                    <span>2.1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Complexity</span>
                    <span>Low</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
