
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AIFoundationDashboard } from "./AIFoundationDashboard";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Activity, 
  Users, 
  MessageSquare,
  Calendar,
  FileText,
  Shield,
  Settings
} from "lucide-react";

export const AgentOverview = () => {
  const [showFoundation, setShowFoundation] = useState(false);
  
  const coreAgents = [
    {
      id: 'schedule-iq',
      name: 'Schedule iQ',
      description: 'AI-powered appointment scheduling with predictive optimization',
      icon: Calendar,
      status: 'active',
      performance: 94,
      tasks: 1847,
      aiLevel: 'Advanced',
      capabilities: ['Natural Language Booking', 'Predictive Scheduling', 'Auto-Conflict Resolution'],
      learningAreas: ['Patient preferences', 'Provider efficiency', 'Demand patterns']
    },
    {
      id: 'intake-iq',
      name: 'Intake iQ',
      description: 'Intelligent patient onboarding and form processing',
      icon: Users,
      status: 'active',
      performance: 91,
      tasks: 892,
      aiLevel: 'Advanced',
      capabilities: ['Smart Form Generation', 'Medical History Analysis', 'Risk Assessment'],
      learningAreas: ['Patient data patterns', 'Clinical workflows', 'Compliance requirements']
    },
    {
      id: 'scribe-iq',
      name: 'Scribe iQ',
      description: 'Automated clinical documentation and note generation',
      icon: FileText,
      status: 'learning',
      performance: 87,
      tasks: 456,
      aiLevel: 'Intermediate',
      capabilities: ['Voice-to-Text', 'SOAP Note Generation', 'Clinical Coding'],
      learningAreas: ['Medical terminology', 'Provider styles', 'Documentation standards']
    },
    {
      id: 'remind-iq',
      name: 'Remind iQ',
      description: 'Intelligent communication and reminder automation',
      icon: MessageSquare,
      status: 'active',
      performance: 96,
      tasks: 2341,
      aiLevel: 'Expert',
      capabilities: ['Multi-Channel Messaging', 'Personalized Content', 'Optimal Timing'],
      learningAreas: ['Patient communication preferences', 'Response patterns', 'Engagement optimization']
    },
    {
      id: 'billing-iq',
      name: 'Billing iQ',
      description: 'Automated billing and revenue cycle management',
      icon: TrendingUp,
      status: 'active',
      performance: 89,
      tasks: 1234,
      aiLevel: 'Advanced',
      capabilities: ['Auto-Coding', 'Claim Processing', 'Revenue Optimization'],
      learningAreas: ['Insurance patterns', 'Coding accuracy', 'Denial prevention']
    },
    {
      id: 'compliance-iq',
      name: 'Compliance iQ',
      description: 'Healthcare compliance monitoring and enforcement',
      icon: Shield,
      status: 'monitoring',
      performance: 98,
      tasks: 567,
      aiLevel: 'Expert',
      capabilities: ['HIPAA Monitoring', 'Audit Trail Analysis', 'Risk Detection'],
      learningAreas: ['Regulatory changes', 'Risk patterns', 'Compliance workflows']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'learning': return 'bg-blue-100 text-blue-700';
      case 'monitoring': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAILevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-700';
      case 'Advanced': return 'bg-blue-100 text-blue-700';
      case 'Intermediate': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (showFoundation) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowFoundation(false)}
            className="mb-4"
          >
            ← Back to Agent Overview
          </Button>
        </div>
        <AIFoundationDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">AI Agent Ecosystem</h3>
          <p className="text-gray-600">Comprehensive AI-native agent management and orchestration</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowFoundation(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Foundation
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Agent Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold">{coreAgents.filter(a => a.status === 'active').length}</p>
              </div>
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold">
                  {Math.round(coreAgents.reduce((acc, agent) => acc + agent.performance, 0) / coreAgents.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">
                  {coreAgents.reduce((acc, agent) => acc + agent.tasks, 0).toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Autonomy</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coreAgents.map((agent) => {
          const IconComponent = agent.icon;
          return (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <p className="text-sm text-gray-600">{agent.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                  <Badge className={getAILevelColor(agent.aiLevel)}>
                    {agent.aiLevel} AI
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Performance</span>
                    <div className="flex items-center gap-2">
                      <Progress value={agent.performance} className="flex-1" />
                      <span className="text-sm font-medium">{agent.performance}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tasks Completed</span>
                    <div className="font-medium">{agent.tasks.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-500 font-medium">AI Capabilities</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.capabilities.map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-500 font-medium">Active Learning</span>
                  <div className="text-xs text-gray-600 mt-1">
                    {agent.learningAreas.join(' • ')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="w-3 h-3 mr-1" />
                    Configure
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Activity className="w-3 h-3 mr-1" />
                    Monitor
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
