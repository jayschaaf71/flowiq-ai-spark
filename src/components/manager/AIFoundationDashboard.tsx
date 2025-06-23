
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiNativeCore, AIAgent, PredictiveInsight, NLQuery } from "@/services/aiNativeCore";
import { 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  Workflow, 
  Zap, 
  Activity,
  Search,
  Target,
  BarChart3,
  Send
} from "lucide-react";

export const AIFoundationDashboard = () => {
  const [agents, setAgents] = useState<Map<string, AIAgent>>(new Map());
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [nlQuery, setNlQuery] = useState("");
  const [queryResults, setQueryResults] = useState<NLQuery[]>([]);
  const [activeTab, setActiveTab] = useState("agents");

  useEffect(() => {
    initializeAIFoundation();
    loadPredictiveInsights();
  }, []);

  const initializeAIFoundation = async () => {
    const initializedAgents = await aiNativeCore.initializeAIFoundation();
    setAgents(initializedAgents);
  };

  const loadPredictiveInsights = async () => {
    const newInsights = await aiNativeCore.generatePredictiveInsights();
    setInsights(newInsights);
  };

  const handleNaturalLanguageQuery = async () => {
    if (!nlQuery.trim()) return;
    
    const result = await aiNativeCore.processNaturalLanguageQuery(nlQuery);
    setQueryResults(prev => [result, ...prev]);
    setNlQuery("");
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'learning': return 'bg-blue-100 text-blue-700';
      case 'idle': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'no_show_prediction': return Target;
      case 'revenue_forecast': return TrendingUp;
      case 'scheduling_optimization': return Activity;
      default: return BarChart3;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI-Native Foundation
          </h2>
          <p className="text-gray-600">
            Core AI architecture with predictive analytics, autonomous workflows, and natural language intelligence
          </p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">
          <Zap className="w-3 h-3 mr-1" />
          AI-Native Architecture
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Agents
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Predictive Analytics
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="w-4 h-4" />
            Autonomous Workflows
          </TabsTrigger>
          <TabsTrigger value="nlp" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Natural Language
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from(agents.values()).map((agent) => (
              <Card key={agent.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <Badge className={getAgentStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Accuracy</span>
                        <div className="font-medium">{agent.performance.accuracy}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Tasks</span>
                        <div className="font-medium">{agent.performance.tasksCompleted}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Learning</span>
                        <div className="font-medium">{(agent.performance.learningRate * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Capabilities</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agent.capabilities.map((capability, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {capability.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight) => {
              const IconComponent = getInsightTypeIcon(insight.type);
              return (
                <Card key={insight.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        {insight.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                        <Badge>
                          {insight.timeframe.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                          {JSON.stringify(insight.prediction, null, 2)}
                        </pre>
                      </div>
                      {insight.actionable && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Recommendations:</span>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            {insight.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-green-600" />
                Autonomous Workflow Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-green-600">Average Autonomy</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2,847</div>
                  <div className="text-sm text-blue-600">Auto-Executed Tasks</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">96%</div>
                  <div className="text-sm text-purple-600">Decision Accuracy</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Active Autonomous Workflows</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Patient Onboarding', autonomy: 90, status: 'active' },
                    { name: 'Appointment Optimization', autonomy: 85, status: 'active' },
                    { name: 'Follow-up Management', autonomy: 78, status: 'learning' }
                  ].map((workflow, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-sm text-gray-600">{workflow.autonomy}% autonomous</div>
                      </div>
                      <Badge className={workflow.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                        {workflow.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nlp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Natural Language Practice Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about your practice data: 'Show me patients due for cleanings who haven't scheduled in the past six months'"
                    value={nlQuery}
                    onChange={(e) => setNlQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNaturalLanguageQuery()}
                    className="flex-1"
                  />
                  <Button onClick={handleNaturalLanguageQuery} disabled={!nlQuery.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  Try these example queries:
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      "Show me revenue trends for this month",
                      "Which patients are overdue for appointments?",
                      "Optimize my schedule for next week",
                      "Generate a report on no-show patterns"
                    ].map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setNlQuery(example)}
                        className="text-xs"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>

                {queryResults.length > 0 && (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {queryResults.map((result) => (
                        <div key={result.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">{result.query}</div>
                            <Badge variant="outline">
                              {Math.round(result.confidence * 100)}% confident
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Intent:</strong> {result.intent}
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <pre className="whitespace-pre-wrap overflow-x-auto">
                              {JSON.stringify(result.response, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
