
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Workflow, 
  Play, 
  Pause, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'pending' | 'failed';
  duration: string;
  success_rate: number;
}

interface AutomatedWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'patient_care' | 'billing' | 'scheduling' | 'documentation';
  status: 'active' | 'paused' | 'inactive';
  success_rate: number;
  runs_today: number;
  time_saved: string;
  steps: WorkflowStep[];
  enabled: boolean;
}

export const AutomatedWorkflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomatedWorkflow[]>([
    {
      id: '1',
      name: 'Patient Onboarding',
      description: 'Automated patient registration, form assignment, and welcome sequence',
      category: 'patient_care',
      status: 'active',
      success_rate: 94,
      runs_today: 12,
      time_saved: '2.5 hrs',
      enabled: true,
      steps: [
        { id: '1', name: 'Send Welcome Email', status: 'completed', duration: '30s', success_rate: 98 },
        { id: '2', name: 'Assign Intake Forms', status: 'completed', duration: '15s', success_rate: 100 },
        { id: '3', name: 'Schedule Follow-up', status: 'active', duration: '45s', success_rate: 92 },
        { id: '4', name: 'Notify Staff', status: 'pending', duration: '10s', success_rate: 96 }
      ]
    },
    {
      id: '2',
      name: 'Appointment Confirmation',
      description: 'Automated reminder sequence with smart timing and response handling',
      category: 'scheduling',
      status: 'active',
      success_rate: 89,
      runs_today: 45,
      time_saved: '3.2 hrs',
      enabled: true,
      steps: [
        { id: '1', name: 'Send 24h Reminder', status: 'completed', duration: '20s', success_rate: 94 },
        { id: '2', name: 'Send 2h Reminder', status: 'completed', duration: '20s', success_rate: 91 },
        { id: '3', name: 'Process Responses', status: 'completed', duration: '1m', success_rate: 87 },
        { id: '4', name: 'Update Schedule', status: 'completed', duration: '30s', success_rate: 99 }
      ]
    },
    {
      id: '3',
      name: 'Billing & Claims',
      description: 'Automated claim generation, submission, and follow-up for rejected claims',
      category: 'billing',
      status: 'active',
      success_rate: 78,
      runs_today: 23,
      time_saved: '4.1 hrs',
      enabled: true,
      steps: [
        { id: '1', name: 'Generate Claims', status: 'completed', duration: '2m', success_rate: 95 },
        { id: '2', name: 'Submit to Payers', status: 'completed', duration: '1m', success_rate: 92 },
        { id: '3', name: 'Track Status', status: 'active', duration: '30s', success_rate: 88 },
        { id: '4', name: 'Handle Rejections', status: 'pending', duration: '3m', success_rate: 65 }
      ]
    }
  ]);

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === id 
        ? { ...workflow, enabled: !workflow.enabled }
        : workflow
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'inactive': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'active': return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'patient_care': return Users;
      case 'billing': return DollarSign;
      case 'scheduling': return Calendar;
      case 'documentation': return FileText;
      default: return Workflow;
    }
  };

  const totalTimeSaved = workflows.reduce((total, workflow) => {
    const hours = parseFloat(workflow.time_saved.replace(' hrs', ''));
    return total + hours;
  }, 0);

  const totalRuns = workflows.reduce((total, workflow) => total + workflow.runs_today, 0);

  const avgSuccessRate = workflows.reduce((total, workflow) => total + workflow.success_rate, 0) / workflows.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Workflow className="h-8 w-8 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-bold">Automated Workflows</h2>
          <p className="text-gray-600">Manage and monitor your AI-powered automation workflows</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalTimeSaved.toFixed(1)} hrs</div>
              <div className="text-sm text-gray-600">Time Saved Today</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalRuns}</div>
              <div className="text-sm text-gray-600">Workflow Runs</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{avgSuccessRate.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Avg Success Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{workflows.filter(w => w.enabled).length}</div>
              <div className="text-sm text-gray-600">Active Workflows</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Workflows</CardTitle>
          <CardDescription>Monitor and manage your automated processes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {workflows.map((workflow) => {
              const Icon = getCategoryIcon(workflow.category);
              
              return (
                <div key={workflow.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Icon className="h-8 w-8 text-gray-600 mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold">{workflow.name}</h3>
                          <Badge variant="outline" className={getStatusColor(workflow.status)}>
                            {workflow.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{workflow.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Success Rate: {workflow.success_rate}%</span>
                          <span>Runs Today: {workflow.runs_today}</span>
                          <span>Time Saved: {workflow.time_saved}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <div className="text-sm text-gray-600 mb-1">Performance</div>
                        <Progress value={workflow.success_rate} className="w-20" />
                      </div>
                      
                      <Switch
                        checked={workflow.enabled}
                        onCheckedChange={() => toggleWorkflow(workflow.id)}
                      />
                      
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Workflow Steps */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Workflow Steps</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {workflow.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                          {getStepStatusIcon(step.status)}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{step.name}</div>
                            <div className="text-xs text-gray-500">
                              {step.duration} • {step.success_rate}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Play className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold">Create Workflow</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Build custom automated workflows using our drag-and-drop interface
            </p>
            <Button size="sm" className="w-full">Start Building</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold">Template Library</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Browse pre-built workflow templates for common practice scenarios
            </p>
            <Button size="sm" variant="outline" className="w-full">Browse Templates</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold">Workflow Analytics</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Detailed performance metrics and optimization suggestions
            </p>
            <Button size="sm" variant="outline" className="w-full">View Analytics</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
