
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Workflow, 
  Zap, 
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'active' | 'pending' | 'error';
  automationEnabled: boolean;
  completedCount: number;
  totalCount: number;
}

interface BillingWorkflowType {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'stopped';
  completionRate: number;
  steps: WorkflowStep[];
}

export const BillingWorkflow: React.FC = () => {
  const [workflows] = useState<BillingWorkflowType[]>([
    {
      id: '1',
      name: 'Claims Processing Workflow',
      description: 'Automated claim generation, validation, and submission',
      status: 'active',
      completionRate: 87,
      steps: [
        {
          id: '1',
          name: 'Charge Capture',
          description: 'Automatically capture charges from appointments',
          status: 'completed',
          automationEnabled: true,
          completedCount: 45,
          totalCount: 45
        },
        {
          id: '2',
          name: 'Code Assignment',
          description: 'AI-powered medical coding',
          status: 'active',
          automationEnabled: true,
          completedCount: 38,
          totalCount: 45
        },
        {
          id: '3',
          name: 'Claim Validation',
          description: 'Validate claim data and coding',
          status: 'pending',
          automationEnabled: false,
          completedCount: 0,
          totalCount: 45
        },
        {
          id: '4',
          name: 'Submission',
          description: 'Submit claims to payers',
          status: 'pending',
          automationEnabled: true,
          completedCount: 0,
          totalCount: 45
        }
      ]
    },
    {
      id: '2',
      name: 'Payment Processing Workflow',
      description: 'Automated payment posting and reconciliation',
      status: 'active',
      completionRate: 92,
      steps: [
        {
          id: '1',
          name: 'ERA Processing',
          description: 'Process electronic remittance advice',
          status: 'completed',
          automationEnabled: true,
          completedCount: 23,
          totalCount: 23
        },
        {
          id: '2',
          name: 'Auto-Posting',
          description: 'Automatically post payments to claims',
          status: 'completed',
          automationEnabled: true,
          completedCount: 21,
          totalCount: 23
        },
        {
          id: '3',
          name: 'Reconciliation',
          description: 'Reconcile payments with expected amounts',
          status: 'active',
          automationEnabled: false,
          completedCount: 18,
          totalCount: 23
        }
      ]
    }
  ]);

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'active': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Workflow className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">Billing Workflow Automation</h2>
          <p className="text-gray-600">Manage automated billing processes</p>
        </div>
      </div>

      {/* Workflow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <div className="text-sm text-gray-600">Automation Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2.3h</div>
              <div className="text-sm text-gray-600">Time Saved</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">98.5%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Workflows */}
      <div className="space-y-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5" />
                    {workflow.name}
                  </CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{workflow.completionRate}%</span>
                  </div>
                  <Progress value={workflow.completionRate} className="h-3" />
                </div>
                
                <div className="space-y-3">
                  {workflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-500 w-6">
                          {index + 1}
                        </div>
                        {getStepStatusIcon(step.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{step.name}</span>
                          {step.automationEnabled && (
                            <Badge variant="outline" className="text-blue-600 border-blue-300">
                              <Zap className="h-3 w-3 mr-1" />
                              Automated
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {step.completedCount} / {step.totalCount}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((step.completedCount / step.totalCount) * 100)}%
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
          <CardDescription>
            Pre-built workflow templates for common billing processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <h3 className="font-medium">Denial Management</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Automated denial identification and correction workflow
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Workflow
              </Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Follow-up Process</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Automated follow-up on unpaid claims and patient balances
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Workflow
              </Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">Quality Assurance</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Automated quality checks for claims before submission
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Workflow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
