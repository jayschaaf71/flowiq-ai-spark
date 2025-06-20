
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, Zap, Clock, CheckCircle } from "lucide-react";

export const AIAgentPerformance = () => {
  const agents = [
    {
      name: "Schedule iQ",
      description: "Appointment scheduling optimization",
      efficiency: 94,
      tasksCompleted: 1247,
      avgResponseTime: "1.2s",
      successRate: 98.5,
      improvements: "+23% efficiency this month",
      status: "active"
    },
    {
      name: "Intake iQ", 
      description: "Patient intake form processing",
      efficiency: 91,
      tasksCompleted: 892,
      avgResponseTime: "0.8s",
      successRate: 96.2,
      improvements: "+18% accuracy improvement",
      status: "active"
    },
    {
      name: "Remind iQ",
      description: "Automated patient reminders",
      efficiency: 89,
      tasksCompleted: 2156,
      avgResponseTime: "0.3s",
      successRate: 99.1,
      improvements: "+31% response rate",
      status: "active"
    },
    {
      name: "Billing iQ",
      description: "Insurance claims processing",
      efficiency: 87,
      tasksCompleted: 634,
      avgResponseTime: "2.1s", 
      successRate: 94.8,
      improvements: "+12% claim approval rate",
      status: "active"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Agent Performance
        </CardTitle>
        <CardDescription>Real-time performance metrics for all AI agents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.name} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium flex items-center gap-2">
                  {agent.name}
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">AI</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{agent.description}</div>
              </div>
              <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                {agent.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Efficiency
                </div>
                <div className="font-medium">{agent.efficiency}%</div>
                <Progress value={agent.efficiency} className="mt-1" />
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Success Rate
                </div>
                <div className="font-medium">{agent.successRate}%</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Avg Response
                </div>
                <div className="font-medium">{agent.avgResponseTime}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Tasks Completed</div>
                <div className="font-medium">{agent.tasksCompleted.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              {agent.improvements}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
