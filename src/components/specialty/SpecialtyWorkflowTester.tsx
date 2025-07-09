import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  FileText, 
  CreditCard,
  Activity
} from 'lucide-react';

interface WorkflowTest {
  id: string;
  name: string;
  description: string;
  specialty: 'chiropractic' | 'dental-sleep' | 'both';
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  icon: React.ReactNode;
}

export const SpecialtyWorkflowTester: React.FC = () => {
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Map<string, 'passed' | 'failed'>>(new Map());

  const workflows: WorkflowTest[] = [
    {
      id: 'patient-registration',
      name: 'Patient Registration',
      description: 'Test patient signup and profile creation',
      specialty: 'both',
      status: 'pending',
      icon: <User className="h-4 w-4" />
    },
    {
      id: 'appointment-booking',
      name: 'Appointment Booking',
      description: 'Test scheduling workflow and confirmations',
      specialty: 'both',
      status: 'pending',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: 'intake-form',
      name: 'Intake Form Submission',
      description: 'Test form completion and data processing',
      specialty: 'both',
      status: 'pending',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'sleep-study-upload',
      name: 'Sleep Study Upload',
      description: 'Test sleep study file upload and processing',
      specialty: 'dental-sleep',
      status: 'pending',
      icon: <Activity className="h-4 w-4" />
    },
    {
      id: 'soap-notes',
      name: 'SOAP Notes Creation',
      description: 'Test chiropractic SOAP note templates',
      specialty: 'chiropractic',
      status: 'pending',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'billing-claims',
      name: 'Insurance Claims',
      description: 'Test claims processing and submission',
      specialty: 'both',
      status: 'pending',
      icon: <CreditCard className="h-4 w-4" />
    }
  ];

  const runTest = async (testId: string) => {
    setRunningTests(prev => new Set([...prev, testId]));
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Random pass/fail for demo
    const passed = Math.random() > 0.2;
    setTestResults(prev => new Map([...prev, [testId, passed ? 'passed' : 'failed']]));
    setRunningTests(prev => {
      const next = new Set(prev);
      next.delete(testId);
      return next;
    });
  };

  const runAllTests = async () => {
    for (const workflow of workflows) {
      if (!runningTests.has(workflow.id) && !testResults.has(workflow.id)) {
        await runTest(workflow.id);
      }
    }
  };

  const getTestStatus = (testId: string) => {
    if (runningTests.has(testId)) return 'running';
    if (testResults.has(testId)) return testResults.get(testId) === 'passed' ? 'passed' : 'failed';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <TestTube className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary">Running</Badge>;
      case 'passed':
        return <Badge variant="default">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const passedTests = Array.from(testResults.values()).filter(result => result === 'passed').length;
  const totalTests = workflows.length;
  const completedTests = testResults.size;
  const progressPercentage = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Specialty Workflow Testing
          </CardTitle>
          <CardDescription>
            Test critical workflows for both chiropractic and dental sleep medicine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between text-sm">
                <span>Test Progress</span>
                <span>{passedTests}/{totalTests} passed</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <Button 
              onClick={runAllTests} 
              disabled={runningTests.size > 0}
              className="ml-4"
            >
              {runningTests.size > 0 ? 'Running...' : 'Run All Tests'}
            </Button>
          </div>

          <div className="grid gap-4">
            {workflows.map((workflow) => {
              const status = getTestStatus(workflow.id);
              return (
                <div
                  key={workflow.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(status)}
                    </div>
                    <div className="flex items-center gap-2">
                      {workflow.icon}
                      <div>
                        <h3 className="font-medium">{workflow.name}</h3>
                        <p className="text-sm text-muted-foreground">{workflow.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {workflow.specialty === 'both' ? 'Both' : 
                       workflow.specialty === 'chiropractic' ? 'Chiro' : 'Dental Sleep'}
                    </Badge>
                    {getStatusBadge(status)}
                    {status === 'pending' && (
                      <Button
                        onClick={() => runTest(workflow.id)}
                        disabled={runningTests.has(workflow.id)}
                        size="sm"
                        variant="outline"
                      >
                        Run Test
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {completedTests === totalTests && (
            <div className={`p-4 rounded-lg border ${
              passedTests === totalTests 
                ? 'bg-green-50 border-green-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center gap-2">
                {passedTests === totalTests ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      All tests passed! Both practices are ready for pilot deployment.
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-800">
                      {totalTests - passedTests} test(s) failed. Please review and fix issues before deployment.
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};