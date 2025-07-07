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
  isExecuting?: boolean;
  onExecute?: () => void;
}

export const WorkflowCard = ({ workflow, isExecuting = false, onExecute }: WorkflowCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "optimization":
        return "bg-warning/10 text-warning border-warning/20";
      case "paused":
        return "bg-muted text-muted-foreground border-border";
      case "draft":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-success";
    if (efficiency >= 70) return "text-warning";
    return "text-destructive";
  };

  const handleQuickAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    
    if (action === 'execute' && onExecute) {
      onExecute();
      return;
    }
    
    console.log(`${action} workflow:`, workflow.id);
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 group cursor-pointer ${
      isExecuting ? 'ring-2 ring-primary animate-pulse' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
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
            {isExecuting ? 'Executing...' : workflow.status}
          </Badge>
          <span className="text-sm text-muted-foreground">Last run: {workflow.lastRun}</span>
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
              disabled={isExecuting}
            >
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={(e) => handleQuickAction(e, 'execute')}
              disabled={isExecuting}
            >
              <Play className="h-3 w-3 mr-1" />
              {isExecuting ? 'Running...' : 'Execute'}
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
