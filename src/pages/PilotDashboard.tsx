import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Calendar, 
  Users, 
  DollarSign, 
  ClipboardList, 
  Bell, 
  Stethoscope, 
  Receipt, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Zap,
  Shield,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const PilotDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Mock pilot data - in production, this would come from the database
  const [pilotData, setPilotData] = useState({
    practice: "Midwest Dental & West County Spine",
    deployment: "Beta v1.0",
    uptime: "99.8%",
    totalPatients: 1247,
    appointmentsToday: 28,
    completedIntakes: 89,
    pendingClaims: 45,
    aiProcessedClaims: 123,
    revenueThisMonth: 284750,
    avgResponseTime: "1.2s"
  });

  const [systemHealth, setSystemHealth] = useState({
    scheduleiq: { status: 'active', uptime: 99.9, lastProcessed: '2 min ago' },
    intakeiq: { status: 'active', uptime: 99.7, lastProcessed: '1 min ago' },
    claimsiq: { status: 'active', uptime: 99.8, lastProcessed: '30 sec ago' },
    billingiq: { status: 'active', uptime: 99.5, lastProcessed: '5 min ago' },
    scribeiq: { status: 'active', uptime: 99.6, lastProcessed: '3 min ago' },
    remindiq: { status: 'active', uptime: 99.9, lastProcessed: '1 min ago' }
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setPilotData(prev => ({
        ...prev,
        appointmentsToday: prev.appointmentsToday + Math.floor(Math.random() * 3),
        completedIntakes: prev.completedIntakes + Math.floor(Math.random() * 2)
      }));
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const aiAgents = [
    {
      name: 'Schedule iQ',
      icon: Calendar,
      path: '/agents/schedule',
      status: systemHealth.scheduleiq.status,
      description: 'AI-powered appointment scheduling',
      metrics: '28 appointments booked today',
      color: 'blue'
    },
    {
      name: 'Intake iQ',
      icon: ClipboardList,
      path: '/agents/intake',
      status: systemHealth.intakeiq.status,
      description: 'Smart patient intake processing',
      metrics: '89 forms completed',
      color: 'green'
    },
    {
      name: 'Claims iQ',
      icon: Receipt,
      path: '/agents/claims',
      status: systemHealth.claimsiq.status,
      description: 'Automated claims management',
      metrics: '123 claims processed',
      color: 'purple'
    },
    {
      name: 'Billing iQ',
      icon: DollarSign,
      path: '/agents/billing',
      status: systemHealth.billingiq.status,
      description: 'Revenue cycle optimization',
      metrics: '$284,750 processed',
      color: 'amber'
    },
    {
      name: 'Scribe iQ',
      icon: Stethoscope,
      path: '/agents/scribe',
      status: systemHealth.scribeiq.status,
      description: 'AI medical documentation',
      metrics: '156 notes generated',
      color: 'indigo'
    },
    {
      name: 'Remind iQ',
      icon: Bell,
      path: '/agents/remind',
      status: systemHealth.remindiq.status,
      description: 'Smart reminder system',
      metrics: '84% response rate',
      color: 'pink'
    }
  ];

  const quickActions = [
    { label: 'Patient Management', icon: Users, path: '/patient-management' },
    { label: 'Schedule Overview', icon: Calendar, path: '/schedule' },
    { label: 'Financial Reports', icon: DollarSign, path: '/financial' },
    { label: 'Compliance Dashboard', icon: Shield, path: '/compliance' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <PageHeader 
            title="FlowIQ Beta Pilot"
            subtitle="Production-ready healthcare practice automation"
          />
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-700">
            <Activity className="w-3 h-3 mr-1" />
            Live Beta
          </Badge>
          <Badge className="bg-blue-100 text-blue-700">
            <Building2 className="w-3 h-3 mr-1" />
            Multi-Specialty
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{pilotData.totalPatients.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold">{pilotData.appointmentsToday}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${pilotData.revenueThisMonth.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">{pilotData.uptime}</p>
              </div>
              <Zap className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <Card key={agent.name} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(agent.path)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-6 w-6 text-${agent.color}-600`} />
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                      </div>
                      <Badge className={agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {agent.status === 'active' ? 'Active' : 'Offline'}
                      </Badge>
                    </div>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-gray-900">{agent.metrics}</p>
                    <Button 
                      variant="outline" 
                      className="w-full mt-3"
                      onClick={() => {
                        navigate(agent.path);
                        toast({
                          title: `${agent.name} Dashboard`,
                          description: `Opening ${agent.name} dashboard`
                        });
                      }}
                    >
                      Open Dashboard
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Performance</CardTitle>
                <CardDescription>Real-time operational metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Intake Forms Completed</span>
                  <span className="font-bold">{pilotData.completedIntakes}</span>
                </div>
                <Progress value={75} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Claims Processed</span>
                  <span className="font-bold">{pilotData.aiProcessedClaims}</span>
                </div>
                <Progress value={92} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">AI Automation Rate</span>
                  <span className="font-bold">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Agent Performance</CardTitle>
                <CardDescription>Processing efficiency by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(systemHealth).map(([agent, health]) => (
                    <div key={agent} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{agent.replace('iq', ' iQ')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{health.uptime}%</span>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health Monitor</CardTitle>
              <CardDescription>Real-time status of all AI agents and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(systemHealth).map(([agent, health]) => (
                  <div key={agent} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{agent.replace('iq', ' iQ')}</span>
                      <Badge className={health.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {health.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Uptime: {health.uptime}%</p>
                      <p>Last processed: {health.lastProcessed}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Information</CardTitle>
                <CardDescription>Current beta deployment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Practice:</p>
                    <p className="text-gray-600">{pilotData.practice}</p>
                  </div>
                  <div>
                    <p className="font-medium">Version:</p>
                    <p className="text-gray-600">{pilotData.deployment}</p>
                  </div>
                  <div>
                    <p className="font-medium">Environment:</p>
                    <p className="text-gray-600">Production Beta</p>
                  </div>
                  <div>
                    <p className="font-medium">Response Time:</p>
                    <p className="text-gray-600">{pilotData.avgResponseTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common pilot management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.label}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate(action.path)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PilotDashboard;