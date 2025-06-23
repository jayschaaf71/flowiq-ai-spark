
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Brain, 
  Zap, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Activity,
  TrendingUp
} from "lucide-react";

interface WorkflowExecutionEngineProps {
  workflowId: string;
  onExecutionUpdate?: (execution: any) => void;
}

export const WorkflowExecutionEngine = ({ workflowId, onExecutionUpdate }: WorkflowExecutionEngineProps) => {
  const [execution, setExecution] = useState({
    id: 'exec-' + Date.now(),
    status: 'ready',
    progress: 0,
    currentStep: 0,
    aiDecisions: [],
    performance: {
      efficiency: 0,
      accuracy: 0,
      autonomy: 0
    },
    startTime: null,
    endTime: null
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    decisionsPerSecond: 0,
    aiConfidence: 0,
    resourceUtilization: 0,
    errorRate: 0
  });

  const workflowSteps = [
    { 
      name: "Initialize AI Context", 
      agent: "System", 
      ai: "Load ML models and context", 
      duration: 2000,
      aiDecisions: ["Model selection", "Context prioritization", "Resource allocation"]
    },
    { 
      name: "Patient Data Analysis", 
      agent: "Intake iQ", 
      ai: "Intelligent data processing", 
      duration: 3000,
      aiDecisions: ["Risk assessment", "Priority scoring", "Form optimization"]
    },
    { 
      name: "Predictive Scheduling", 
      agent: "Schedule iQ", 
      ai: "Optimal slot prediction", 
      duration: 2500,
      aiDecisions: ["Provider matching", "Time optimization", "Conflict resolution"]
    },
    { 
      name: "Communication Automation", 
      agent: "Remind iQ", 
      ai: "Personalized messaging", 
      duration: 1500,
      aiDecisions: ["Channel selection", "Content personalization", "Timing optimization"]
    },
    { 
      name: "Workflow Optimization", 
      agent: "Manager iQ", 
      ai: "Continuous improvement", 
      duration: 1000,
      aiDecisions: ["Performance analysis", "Pattern recognition", "Process refinement"]
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (execution.status === 'running') {
      interval = setInterval(() => {
        setRealTimeMetrics(prev => ({
          decisionsPerSecond: Math.random() * 15 + 5,
          aiConfidence: Math.random() * 20 + 80,
          resourceUtilization: Math.random() * 30 + 60,
          errorRate: Math.random() * 2
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [execution.status]);

  const startExecution = async () => {
    setExecution(prev => ({
      ...prev,
      status: 'running',
      startTime: new Date(),
      progress: 0,
      currentStep: 0,
      aiDecisions: []
    }));

    // Simulate AI-driven workflow execution
    for (let i = 0; i < workflowSteps.length; i++) {
      const step = workflowSteps[i];
      
      setExecution(prev => ({
        ...prev,
        currentStep: i,
        progress: ((i + 1) / workflowSteps.length) * 100
      }));

      // Simulate AI decision making for each step
      for (const decision of step.aiDecisions) {
        await new Promise(resolve => setTimeout(resolve, step.duration / step.aiDecisions.length));
        
        setExecution(prev => ({
          ...prev,
          aiDecisions: [...prev.aiDecisions, {
            step: step.name,
            decision,
            confidence: Math.random() * 20 + 80,
            timestamp: new Date(),
            agent: step.agent
          }]
        }));
      }
    }

    setExecution(prev => ({
      ...prev,
      status: 'completed',
      endTime: new Date(),
      performance: {
        efficiency: Math.random() * 20 + 80,
        accuracy: Math.random() * 15 + 85,
        autonomy: Math.random() * 25 + 75
      }
    }));

    onExecutionUpdate?.(execution);
  };

  const pauseExecution = () => {
    setExecution(prev => ({ ...prev, status: 'paused' }));
  };

  const resetExecution = () => {
    setExecution({
      id: 'exec-' + Date.now(),
      status: 'ready',
      progress: 0,
      currentStep: 0,
      aiDecisions: [],
      performance: { efficiency: 0, accuracy: 0, autonomy: 0 },
      startTime: null,
      endTime: null
    });
  };

  const getStatusIcon = () => {
    switch (execution.status) {
      case 'running': return <Activity className="w-4 h-4 text-green-600 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'paused': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getExecutionTime = () => {
    if (!execution.startTime) return "0s";
    const endTime = execution.endTime || new Date();
    const duration = Math.floor((endTime.getTime() - execution.startTime.getTime()) / 1000);
    return `${duration}s`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Live AI Workflow Execution
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Badge className={`
                ${execution.status === 'running' ? 'bg-green-100 text-green-700' : ''}
                ${execution.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
                ${execution.status === 'paused' ? 'bg-orange-100 text-orange-700' : ''}
                ${execution.status === 'ready' ? 'bg-gray-100 text-gray-700' : ''}
              `}>
                {execution.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Execution Controls */}
            <div className="flex gap-2">
              <Button 
                onClick={startExecution} 
                disabled={execution.status === 'running'}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {execution.status === 'ready' ? 'Start AI Execution' : 'Resume'}
              </Button>
              <Button 
                onClick={pauseExecution} 
                disabled={execution.status !== 'running'}
                variant="outline"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button 
                onClick={resetExecution}
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Execution Progress</span>
                <span className="text-sm text-gray-600">
                  {Math.round(execution.progress)}% • {getExecutionTime()}
                </span>
              </div>
              <Progress value={execution.progress} />
            </div>

            {/* Real-time Metrics */}
            {execution.status === 'running' && (
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {realTimeMetrics.decisionsPerSecond.toFixed(1)}/s
                  </div>
                  <div className="text-xs text-gray-600">AI Decisions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {realTimeMetrics.aiConfidence.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">AI Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {realTimeMetrics.resourceUtilization.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Resource Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {realTimeMetrics.errorRate.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-600">Error Rate</div>
                </div>
              </div>
            )}

            {/* Step Progress */}
            <div>
              <h4 className="font-medium mb-3">Workflow Steps</h4>
              <div className="space-y-2">
                {workflowSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-lg ${
                      index === execution.currentStep && execution.status === 'running' 
                        ? 'border-blue-500 bg-blue-50' 
                        : index < execution.currentStep 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {index < execution.currentStep ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : index === execution.currentStep && execution.status === 'running' ? (
                          <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{step.name}</div>
                          <div className="text-xs text-gray-600">{step.ai}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        {step.agent}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Decisions Log */}
      {execution.aiDecisions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Live AI Decision Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {execution.aiDecisions.map((decision, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{decision.decision}</div>
                      <div className="text-xs text-gray-600">
                        {decision.step} • {decision.agent}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {decision.confidence.toFixed(1)}% confidence
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {decision.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      {execution.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              AI Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {execution.performance.efficiency.toFixed(1)}%
                </div>
                <div className="text-sm text-green-600">Efficiency</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {execution.performance.accuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-blue-600">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {execution.performance.autonomy.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-600">Autonomy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
