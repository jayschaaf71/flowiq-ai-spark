import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Settings,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Activity,
  TrendingUp,
  Shield,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const OpsIQ = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock data - in production this would come from your API
  const operationalStats = {
    activeAgents: 6,
    systemUptime: 99.8,
    tasksCompleted: 1247,
    efficiencyGain: 34.5
  };

  const agentStatus = [
    { name: 'Appointment IQ', status: 'active', uptime: 99.9, tasks: 284, load: 75 },
    { name: 'Intake IQ', status: 'active', uptime: 99.7, tasks: 156, load: 60 },
    { name: 'Claims IQ', status: 'active', uptime: 99.8, tasks: 342, load: 85 },
    { name: 'Payments IQ', status: 'active', uptime: 99.5, tasks: 198, load: 45 },
    { name: 'Scribe IQ', status: 'active', uptime: 99.6, tasks: 89, load: 30 },
    { name: 'Insights IQ', status: 'active', uptime: 99.9, tasks: 67, load: 25 }
  ];

  const automationTasks = [
    { id: 1, task: 'Patient intake processing', status: 'running', processed: 23, queue: 5 },
    { id: 2, task: 'Appointment reminders', status: 'running', processed: 45, queue: 12 },
    { id: 3, task: 'Claims validation', status: 'running', processed: 34, queue: 8 },
    { id: 4, task: 'Payment follow-ups', status: 'scheduled', processed: 0, queue: 15 }
  ];

  const systemAlerts = [
    { type: 'warning', message: 'Claims IQ processing load at 85%', time: '10 minutes ago' },
    { type: 'info', message: 'Scheduled maintenance window tonight 11 PM - 12 AM', time: '2 hours ago' },
    { type: 'success', message: 'All agents passed health check', time: '4 hours ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'running': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Ops IQ"
        subtitle="Practice operations management and system orchestration"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">{operationalStats.activeAgents}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">{operationalStats.systemUptime}%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">{operationalStats.tasksCompleted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efficiency Gain</p>
                <p className="text-2xl font-bold">+{operationalStats.efficiencyGain}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent system notifications and status updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
                <Badge className={getStatusColor(alert.type)}>
                  {alert.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Status</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Overall system health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Usage</span>
                    <span>34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Task Summary</CardTitle>
                <CardDescription>Automated tasks completed today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Appointment bookings</span>
                    <span className="font-bold">28</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Intake forms processed</span>
                    <span className="font-bold">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Claims submitted</span>
                    <span className="font-bold">34</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payments processed</span>
                    <span className="font-bold">67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">SOAP notes generated</span>
                    <span className="font-bold">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Agent Status</CardTitle>
              <CardDescription>Real-time status and performance of all AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentStatus.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Brain className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-gray-600">
                          Uptime: {agent.uptime}% • Tasks: {agent.tasks}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Load</div>
                        <div className="font-bold">{agent.load}%</div>
                      </div>
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Configure Agent",
                            description: `Opening configuration for ${agent.name}`
                          });
                        }}
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Automations</CardTitle>
              <CardDescription>Currently running automated workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">{task.task}</div>
                        <div className="text-sm text-gray-600">
                          Processed: {task.processed} • Queue: {task.queue}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Task Details",
                            description: `Viewing details for ${task.task}`
                          });
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Core system settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Database Settings",
                      description: "Database configuration panel will be available soon"
                    });
                  }}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Database Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Security Configuration",
                      description: "Security settings panel will be available soon"
                    });
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Security Configuration
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Performance Tuning",
                      description: "Performance optimization tools will be available soon"
                    });
                  }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Performance Tuning
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "User Management",
                      description: "User management interface will be available soon"
                    });
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  User Management
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Rules</CardTitle>
                <CardDescription>Configure automated workflows and triggers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Workflow Triggers",
                      description: "Workflow configuration panel will be available soon"
                    });
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Workflow Triggers
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Scheduling Rules",
                      description: "Scheduling configuration panel will be available soon"
                    });
                  }}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Scheduling Rules
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/analytics')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Alert Configuration",
                      description: "Alert configuration panel will be available soon"
                    });
                  }}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Alert Configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OpsIQ;