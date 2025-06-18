
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Copy, Eye } from "lucide-react";

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  agents: string[];
  steps: number;
  completedSteps: number;
  avgTime: string;
  successRate: number;
  lastRun: string;
}

interface WorkflowTemplatesProps {
  workflows: WorkflowTemplate[];
}

export const WorkflowTemplates = ({ workflows }: WorkflowTemplatesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-600" />
                <CardTitle className="text-sm">{workflow.name}</CardTitle>
              </div>
              <Badge className="bg-green-100 text-green-800">Template</Badge>
            </div>
            <CardDescription className="text-xs">
              {workflow.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {workflow.steps} steps • {workflow.avgTime}
              </span>
              <span className="text-muted-foreground">
                {workflow.successRate}% success
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Copy className="w-3 h-3 mr-1" />
                Use Template
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
