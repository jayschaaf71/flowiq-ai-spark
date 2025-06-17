
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentOverview } from "@/components/manager/AgentOverview";
import { TaskQueue } from "@/components/manager/TaskQueue";
import { WorkflowOrchestration } from "@/components/manager/WorkflowOrchestration";
import { SystemMonitoring } from "@/components/manager/SystemMonitoring";
import { Brain, Activity, Zap, AlertTriangle, CheckCircle, Clock, Plus } from "lucide-react";

const ManagerAgent = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for system status
  const systemStats = {
    totalAgents: 7,
    activeAgents: 6,
    tasksProcessed: 156,
    efficiency: 94,
    alerts: 2
  };

  return (
    <Layout>
      <PageHeader 
        title="Manager Agent"
        subtitle="Central AI orchestration and task management"
        badge="AI Manager"
      />
      
      <div className="p-6 space-y-6">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
              <Brain className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalAgents}</div>
              <p className="text-xs text-muted-foreground">
                {systemStats.activeAgents} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.tasksProcessed}</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.efficiency}%</div>
              <p className="text-xs text-muted-foreground">
                System performance
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <p className="text-xs text-muted-foreground">
                Tasks pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{systemStats.alerts}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Agent Overview</TabsTrigger>
              <TabsTrigger value="tasks">Task Queue</TabsTrigger>
              <TabsTrigger value="workflows">Orchestration</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>
            
            <Button onClick={() => setActiveTab("workflows")} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <AgentOverview />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <TaskQueue />
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            <WorkflowOrchestration />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <SystemMonitoring />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ManagerAgent;
