
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, MoreVertical, TrendingUp, Eye } from "lucide-react";

interface WorkflowCardProps {
  workflow: {
    id: number;
    name: string;
    status: string;
    efficiency: number;
    lastRun: string;
    description: string;
  };
}

export const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "optimization":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "paused":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "draft":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-emerald-600";
    if (efficiency >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const handleQuickAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`${action} workflow:`, workflow.id);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
              {workflow.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {workflow.description}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => handleQuickAction(e, 'menu')}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={getStatusColor(workflow.status)}>
            {workflow.status}
          </Badge>
          <span className="text-sm text-gray-500">Last run: {workflow.lastRun}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Efficiency</span>
            <span className={`text-sm font-semibold ${getEfficiencyColor(workflow.efficiency)}`}>
              {workflow.efficiency}%
            </span>
          </div>
          <Progress value={workflow.efficiency} className="h-2" />
        </div>

        <div className="flex items-center gap-2 pt-2">
          {workflow.status === "active" ? (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={(e) => handleQuickAction(e, 'pause')}
            >
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={(e) => handleQuickAction(e, 'run')}
            >
              <Play className="h-3 w-3 mr-1" />
              Run
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => handleQuickAction(e, 'optimize')}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Optimize
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => handleQuickAction(e, 'view')}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
