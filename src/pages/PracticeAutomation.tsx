import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Zap, 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  Target,
  Lightbulb,
  Cpu,
  Database,
  Workflow,
  Plus
} from 'lucide-react';

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  triggers: string[];
  actions: string[];
  runsToday: number;
  successRate: number;
  lastRun: string;
  category: 'scheduling' | 'patient_care' | 'billing' | 'communication';
}

interface AIInsight {
  id: string;
  type: 'efficiency' | 'revenue' | 'patient_care' | 'operational';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  recommendation: string;
  estimatedSavings?: string;
  actionable: boolean;
}

const PracticeAutomation = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const workflows: AutomationWorkflow[] = [
    {
      id: '1',
      name: 'Appointment Reminder Automation',
      description: 'Automatically send SMS and email reminders 24h and 2h before appointments',
      status: 'active',
      triggers: ['appointment_scheduled', 'time_trigger'],
      actions: ['send_sms', 'send_email', 'update_status'],
      runsToday: 47,
      successRate: 98.5,
      lastRun: '2 minutes ago',
      category: 'scheduling'
    },
    {
      id: '2',
      name: 'Insurance Verification Workflow',
      description: 'Automatically verify patient insurance eligibility before appointments',
      status: 'active',
      triggers: ['appointment_created', 'insurance_updated'],
      actions: ['verify_eligibility', 'update_patient_record', 'notify_staff'],
      runsToday: 23,
      successRate: 94.2,
      lastRun: '15 minutes ago',
      category: 'billing'
    },
    {
      id: '3',
      name: 'Care Gap Analysis',
      description: 'Identify patients due for preventive care and schedule outreach',
      status: 'active',
      triggers: ['daily_scan', 'patient_record_update'],
      actions: ['analyze_records', 'identify_gaps', 'create_tasks'],
      runsToday: 156,
      successRate: 91.8,
      lastRun: '1 hour ago',
      category: 'patient_care'
    },
    {
      id: '4',
      name: 'Follow-up Scheduling',
      description: 'Automatically schedule follow-up appointments based on diagnosis codes',
      status: 'paused',
      triggers: ['appointment_completed', 'diagnosis_entered'],
      actions: ['determine_followup', 'schedule_appointment', 'notify_patient'],
      runsToday: 0,
      successRate: 89.3,
      lastRun: 'Yesterday',
      category: 'scheduling'
    }
  ];

  const aiInsights: AIInsight[] = [
    {
      id: '1',
      type: 'efficiency',
      title: 'Reduce No-Show Rate',
      description: 'AI analysis shows 23% of no-shows occur on Mondays. Implementing additional reminders could reduce this by 40%.',
      impact: 'high',
      confidence: 87,
      recommendation: 'Add extra reminder on Sunday evening for Monday appointments',
      estimatedSavings: '$8,400/month',
      actionable: true
    },
    {
      id: '2',
      type: 'revenue',
      title: 'Optimize Appointment Scheduling',
      description: 'Current scheduling leaves 15% capacity unused during peak hours. AI suggests dynamic scheduling adjustments.',
      impact: 'high',
      confidence: 92,
      recommendation: 'Implement AI-driven appointment slot optimization',
      estimatedSavings: '$12,600/month',
      actionable: true
    },
    {
      id: '3',
      type: 'patient_care',
      title: 'Preventive Care Opportunities',
      description: '34% of patients are overdue for routine screenings. Proactive outreach could improve care quality.',
      impact: 'medium',
      confidence: 85,
      recommendation: 'Launch automated preventive care reminder campaign',
      actionable: true
    },
    {
      id: '4',
      type: 'operational',
      title: 'Staff Workload Balance',
      description: 'Uneven task distribution detected. AI suggests workflow redistribution for 20% efficiency gain.',
      impact: 'medium',
      confidence: 79,
      recommendation: 'Implement intelligent task assignment system',
      actionable: false
    }
  ];

  const automationStats = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.status === 'active').length,
    totalRuns: workflows.reduce((sum, w) => sum + w.runsToday, 0),
    averageSuccessRate: workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length,
    timeSaved: '12.5 hours',
    costSavings: '$3,240'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'scheduling': return Calendar;
      case 'patient_care': return Users;
      case 'billing': return BarChart3;
      case 'communication': return Activity;
      default: return Workflow;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Practice Automation</h1>
          <p className="text-muted-foreground">AI-powered workflows and intelligent practice management</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Workflows</p>
                      <p className="text-2xl font-bold text-foreground">{automationStats.activeWorkflows}</p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Runs Today</p>
                      <p className="text-2xl font-bold text-foreground">{automationStats.totalRuns}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold text-foreground">{automationStats.averageSuccessRate.toFixed(1)}%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Time Saved</p>
                      <p className="text-2xl font-bold text-foreground">{automationStats.timeSaved}</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Insights */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Top AI Insights
                </CardTitle>
                <CardDescription>High-impact recommendations from AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="p-4 rounded-lg border bg-muted/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                        <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{insight.recommendation}</p>
                      {insight.estimatedSavings && (
                        <Badge variant="outline" className="text-green-600">
                          {insight.estimatedSavings}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Insights
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Recent Workflow Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workflows.slice(0, 4).map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{workflow.name}</p>
                        <p className="text-sm text-muted-foreground">Last run: {workflow.lastRun}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.status)}`}></div>
                        <span className="text-sm">{workflow.runsToday} runs</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Efficiency</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cost Optimization</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Patient Satisfaction</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Monthly savings: <span className="font-semibold text-green-600">{automationStats.costSavings}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Automation Workflows</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </div>

            <div className="grid gap-6">
              {workflows.map((workflow) => {
                const CategoryIcon = getCategoryIcon(workflow.category);
                return (
                  <Card key={workflow.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CategoryIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">{workflow.name}</h3>
                              <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                                {workflow.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{workflow.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Runs today:</span>
                                <span className="ml-1 font-medium">{workflow.runsToday}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Success rate:</span>
                                <span className="ml-1 font-medium">{workflow.successRate}%</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Last run:</span>
                                <span className="ml-1 font-medium">{workflow.lastRun}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={workflow.status === 'active' ? '' : 'text-green-600'}
                          >
                            {workflow.status === 'active' ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">AI-Powered Insights</h2>
              <Button>
                <RotateCcw className="mr-2 h-4 w-4" />
                Refresh Analysis
              </Button>
            </div>

            <div className="grid gap-6">
              {aiInsights.map((insight) => (
                <Card key={insight.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{insight.title}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{insight.type} optimization</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{insight.description}</p>
                    
                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-foreground mb-2">Recommendation:</h4>
                      <p className="text-sm">{insight.recommendation}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {insight.estimatedSavings && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Estimated savings:</span>
                          <Badge variant="outline" className="text-green-600">
                            {insight.estimatedSavings}
                          </Badge>
                        </div>
                      )}
                      
                      {insight.actionable && (
                        <Button size="sm">
                          Implement Recommendation
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Automation Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Cpu className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold text-foreground">98.7%</p>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Database className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold text-foreground">2.3M</p>
                  <p className="text-sm text-muted-foreground">Records Processed</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold text-foreground">34%</p>
                  <p className="text-sm text-muted-foreground">Efficiency Gain</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold text-foreground">$47K</p>
                  <p className="text-sm text-muted-foreground">Monthly Savings</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Workflow Performance Trends</CardTitle>
                <CardDescription>Success rates and execution times over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-12">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PracticeAutomation;