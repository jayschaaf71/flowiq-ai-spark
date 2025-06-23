
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Zap, TrendingUp, Activity, Settings, Plus } from "lucide-react";

export const WorkflowOrchestrationHeader = () => {
  const orchestrationStats = [
    { label: "Active Workflows", value: "12", icon: Activity, color: "text-blue-600" },
    { label: "AI Autonomy", value: "87%", icon: Brain, color: "text-purple-600" },
    { label: "Efficiency Gain", value: "+34%", icon: TrendingUp, color: "text-green-600" },
    { label: "Auto-Decisions", value: "2,847", icon: Zap, color: "text-orange-600" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Intelligent Workflow Orchestration
          </h2>
          <p className="text-gray-600">
            AI-native workflow automation with autonomous decision making and continuous optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-purple-100 text-purple-700">
            <Zap className="w-3 h-3 mr-1" />
            Self-Optimizing
          </Badge>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Intelligent Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {orchestrationStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                Powered by AI orchestration
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
