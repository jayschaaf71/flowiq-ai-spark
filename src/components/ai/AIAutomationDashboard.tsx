
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  BarChart3,
  Robot,
  Clock,
  Target,
  Activity
} from 'lucide-react';

interface AIAutomation {
  id: string;
  name: string;
  type: 'scheduling' | 'communication' | 'documentation' | 'billing' | 'analytics';
  status: 'active' | 'inactive' | 'learning';
  efficiency: number;
  savings: string;
  enabled: boolean;
  lastRun: string;
}

export const AIAutomationDashboard: React.FC = () => {
  const [automations, setAutomations] = useState<AIAutomation[]>([
    {
      id: '1',
      name: 'Smart Appointment Scheduling',
      type: 'scheduling',
      status: 'active',
      efficiency: 94,
      savings: '3.2 hrs/day',
      enabled: true,
      lastRun: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Automated Patient Reminders',
      type: 'communication',
      status: 'active',
      efficiency: 89,
      savings: '2.1 hrs/day',
      enabled: true,
      lastRun: '15 minutes ago'
    },
    {
      id: '3',
      name: 'AI Documentation Assistant',
      type: 'documentation',
      status: 'learning',
      efficiency: 76,
      savings: '1.8 hrs/day',
      enabled: true,
      lastRun: '1 hour ago'
    },
    {
      id: '4',
      name: 'Predictive Analytics Engine',
      type: 'analytics',
      status: 'active',
      efficiency: 91,
      savings: '4.5 hrs/week',
      enabled: true,
      lastRun: '30 minutes ago'
    }
  ]);

  const [metrics, setMetrics] = useState({
    totalTimeSaved: '12.4 hrs/day',
    efficiencyGain: 34,
    patientSatisfaction: 96,
    costReduction: '$2,340/month'
  });

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, enabled: !automation.enabled }
        : automation
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'learning': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scheduling': return Calendar;
      case 'communication': return MessageSquare;
      case 'documentation': return BarChart3;
      case 'billing': return Target;
      case 'analytics': return TrendingUp;
      default: return Robot;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">AI & Automation Dashboard</h2>
          <p className="text-gray-600">Intelligent automation and AI-powered workflows</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{metrics.totalTimeSaved}</div>
                <div className="text-sm text-gray-600">Time Saved Daily</div>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{metrics.efficiencyGain}%</div>
                <div className="text-sm text-gray-600">Efficiency Gain</div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{metrics.patientSatisfaction}%</div>
                <div className="text-sm text-gray-600">Patient Satisfaction</div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{metrics.costReduction}</div>
                <div className="text-sm text-gray-600">Monthly Savings</div>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Automations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Robot className="h-5 w-5" />
            Active AI Automations
          </CardTitle>
          <CardDescription>
            Manage and monitor your AI-powered automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => {
              const Icon = getTypeIcon(automation.type);
              
              return (
                <div key={automation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon className="h-8 w-8 text-gray-600" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{automation.name}</h3>
                          <Badge className={getStatusColor(automation.status)}>
                            {automation.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Efficiency: {automation.efficiency}% • Saves: {automation.savings}</p>
                          <p>Last run: {automation.lastRun}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">Performance</div>
                        <Progress value={automation.efficiency} className="w-20" />
                      </div>
                      
                      <Switch
                        checked={automation.enabled}
                        onCheckedChange={() => toggleAutomation(automation.id)}
                      />
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
              <Calendar className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold">Smart Scheduling</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              AI optimizes appointment scheduling based on provider availability and patient preferences
            </p>
            <Button size="sm" className="w-full">Configure Settings</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold">Auto Communication</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Automated patient reminders, follow-ups, and personalized messaging
            </p>
            <Button size="sm" className="w-full">Manage Templates</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold">Predictive Analytics</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              AI-powered insights for patient outcomes and practice optimization
            </p>
            <Button size="sm" className="w-full">View Insights</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
