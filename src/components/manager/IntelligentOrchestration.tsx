
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { aiNativeCore } from "@/services/aiNativeCore";
import { 
  Brain, 
  Zap, 
  Target, 
  Activity, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

export const IntelligentOrchestration = () => {
  const [orchestrationMetrics, setOrchestrationMetrics] = useState({
    totalDecisions: 0,
    autonomousDecisions: 0,
    accuracyRate: 0,
    learningProgress: 0
  });

  const [activeWorkflows, setActiveWorkflows] = useState([
    {
      id: 'patient-journey',
      name: 'Intelligent Patient Journey',
      autonomyLevel: 92,
      decisions: 47,
      accuracy: 94,
      status: 'optimizing',
      lastAction: 'Automatically scheduled follow-up based on treatment response'
    },
    {
      id: 'resource-optimization',
      name: 'Dynamic Resource Allocation',
      autonomyLevel: 88,
      decisions: 23,
      accuracy: 91,
      status: 'active',
      lastAction: 'Redistributed provider schedules based on demand prediction'
    },
    {
      id: 'predictive-maintenance',
      name: 'Predictive System Maintenance',
      autonomyLevel: 95,
      decisions: 12,
      accuracy: 98,
      status: 'monitoring',
      lastAction: 'Preemptively addressed potential scheduling conflicts'
    }
  ]);

  const [intelligentInsights, setIntelligentInsights] = useState([
    {
      type: 'opportunity',
      title: 'Revenue Optimization Detected',
      description: 'AI identified 15% revenue increase opportunity through schedule optimization',
      confidence: 89,
      action: 'Auto-implement scheduling changes',
      status: 'pending'
    },
    {
      type: 'risk',
      title: 'Patient Retention Risk',
      description: '8 patients showing early indicators of potential churn',
      confidence: 76,
      action: 'Initiate automated retention workflow',
      status: 'active'
    },
    {
      type: 'efficiency',
      title: 'Workflow Bottleneck Identified',
      description: 'Patient intake process can be optimized by 23%',
      confidence: 92,
      action: 'Deploy autonomous process improvement',
      status: 'completed'
    }
  ]);

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setOrchestrationMetrics(prev => ({
        totalDecisions: prev.totalDecisions + Math.floor(Math.random() * 3),
        autonomousDecisions: prev.autonomousDecisions + Math.floor(Math.random() * 2),
        accuracyRate: Math.min(99, prev.accuracyRate + (Math.random() - 0.5) * 2),
        learningProgress: Math.min(100, prev.learningProgress + Math.random() * 0.5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const executeIntelligentAction = async (insightIndex: number) => {
    const insight = intelligentInsights[insightIndex];
    insight.status = 'executing';
    setIntelligentInsights([...intelligentInsights]);

    // Simulate AI execution
    setTimeout(() => {
      insight.status = 'completed';
      setIntelligentInsights([...intelligentInsights]);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4 text-green-600" />;
      case 'optimizing': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'monitoring': return <Target className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'risk': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'efficiency': return <Zap className="w-4 h-4 text-blue-600" />;
      default: return <Brain className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Intelligent Orchestration Engine
          </h3>
          <p className="text-gray-600">AI-driven autonomous decision making and optimization</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">
          <Zap className="w-3 h-3 mr-1" />
          Self-Optimizing
        </Badge>
      </div>

      {/* Real-time Orchestration Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Decisions</p>
                <p className="text-2xl font-bold">{orchestrationMetrics.totalDecisions}</p>
              </div>
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Autonomous</p>
                <p className="text-2xl font-bold">{orchestrationMetrics.autonomousDecisions}</p>
              </div>
              <Zap className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accuracy Rate</p>
                <p className="text-2xl font-bold">{orchestrationMetrics.accuracyRate.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Learning Progress</p>
                <p className="text-2xl font-bold">{orchestrationMetrics.learningProgress.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Intelligent Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Active Intelligent Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeWorkflows.map((workflow) => (
              <div key={workflow.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(workflow.status)}
                    <div>
                      <h4 className="font-medium">{workflow.name}</h4>
                      <p className="text-sm text-gray-600">{workflow.lastAction}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {workflow.autonomyLevel}% autonomous
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Decisions Made</span>
                    <div className="font-medium">{workflow.decisions}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Accuracy</span>
                    <div className="font-medium">{workflow.accuracy}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Autonomy Level</span>
                    <Progress value={workflow.autonomyLevel} className="mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intelligent Insights & Automated Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Insights & Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {intelligentInsights.map((insight, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-medium flex items-center gap-2">
                        {insight.title}
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <p className="text-sm font-medium text-blue-600 mt-2">
                        Recommended Action: {insight.action}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {insight.status === 'completed' ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    ) : insight.status === 'active' ? (
                      <Badge className="bg-blue-100 text-blue-700">
                        <Activity className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : insight.status === 'executing' ? (
                      <Badge className="bg-orange-100 text-orange-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Executing
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => executeIntelligentAction(index)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Execute
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
