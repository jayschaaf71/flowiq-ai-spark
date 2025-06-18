
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Settings, 
  Activity, 
  Clock, 
  CheckCircle,
  TrendingUp 
} from "lucide-react";

interface WorkflowDetailsDialogProps {
  workflow: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (workflow: any) => void;
  onDelete: (workflowId: number) => void;
  onToggleStatus: (workflowId: number) => void;
}

export const WorkflowDetailsDialog = ({ 
  workflow, 
  open, 
  onOpenChange, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: WorkflowDetailsDialogProps) => {
  if (!workflow) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "optimization":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "paused":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const mockStats = {
    totalRuns: 145,
    successRate: workflow.efficiency || 94,
    avgDuration: "8.5 min",
    lastSuccess: workflow.lastRun,
    tasksCompleted: 1280,
    errorRate: 6
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{workflow.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {workflow.description}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={getStatusColor(workflow.status)}>
              {workflow.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => onToggleStatus(workflow.id)}
              className={workflow.status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {workflow.status === "active" ? (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(workflow)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-3 w-3 mr-1" />
              Configure
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onDelete(workflow.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{workflow.efficiency}%</div>
                    <Progress value={workflow.efficiency} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Last Run</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{workflow.lastRun}</div>
                    <p className="text-xs text-muted-foreground mt-1">Most recent execution</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.totalRuns}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{mockStats.successRate}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.avgDuration}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { time: "2 minutes ago", action: "Workflow completed successfully", status: "success" },
                      { time: "1 hour ago", action: "Workflow started", status: "info" },
                      { time: "3 hours ago", action: "Workflow completed successfully", status: "success" },
                      { time: "6 hours ago", action: "Workflow paused by user", status: "warning" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === "success" ? "bg-green-500" :
                          item.status === "warning" ? "bg-yellow-500" : "bg-blue-500"
                        }`} />
                        <span className="text-muted-foreground">{item.time}</span>
                        <span>{item.action}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
