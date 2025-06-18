
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, Activity } from "lucide-react";

export const PerformanceDashboard = () => {
  const workflowMetrics = [
    {
      name: "Patient Onboarding",
      efficiency: 94,
      trend: "+5%",
      avgTime: "12 min",
      completionRate: 96,
      costSavings: "$2,400"
    },
    {
      name: "Appointment Scheduling", 
      efficiency: 91,
      trend: "+8%",
      avgTime: "6 min",
      completionRate: 98,
      costSavings: "$1,800"
    },
    {
      name: "Insurance Verification",
      efficiency: 87,
      trend: "-2%", 
      avgTime: "15 min",
      completionRate: 89,
      costSavings: "$3,200"
    }
  ];

  const agentPerformance = [
    { name: "Schedule iQ", tasksCompleted: 156, efficiency: 96, uptime: "99.8%" },
    { name: "Intake iQ", tasksCompleted: 134, efficiency: 94, uptime: "99.5%" },
    { name: "Remind iQ", tasksCompleted: 89, efficiency: 98, uptime: "100%" },
    { name: "Billing iQ", tasksCompleted: 67, efficiency: 92, uptime: "99.2%" },
    { name: "Claims iQ", tasksCompleted: 45, efficiency: 88, uptime: "98.9%" },
    { name: "Assist iQ", tasksCompleted: 203, efficiency: 95, uptime: "99.7%" },
    { name: "Scribe iQ", tasksCompleted: 78, efficiency: 91, uptime: "99.1%" }
  ];

  const roiData = {
    totalSavings: "$45,600",
    monthlyROI: "340%",
    timeReduction: "68%",
    errorReduction: "84%"
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{roiData.totalSavings}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{roiData.monthlyROI}</div>
            <p className="text-xs text-muted-foreground">Monthly return</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{roiData.timeReduction}</div>
            <p className="text-xs text-muted-foreground">Process improvement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Reduction</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{roiData.errorReduction}</div>
            <p className="text-xs text-muted-foreground">Quality improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Workflow Performance</TabsTrigger>
          <TabsTrigger value="agents">Agent Analytics</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Efficiency Metrics</CardTitle>
              <CardDescription>Performance analysis for each workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflowMetrics.map((workflow, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{workflow.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        workflow.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {workflow.trend}
                      </span>
                      {workflow.trend.startsWith('+') ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Efficiency</div>
                      <div className="font-medium">{workflow.efficiency}%</div>
                      <Progress value={workflow.efficiency} className="mt-1 h-1" />
                    </div>
                    <div>
                      <div className="text-muted-foreground">Avg Time</div>
                      <div className="font-medium">{workflow.avgTime}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Completion</div>
                      <div className="font-medium">{workflow.completionRate}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Savings</div>
                      <div className="font-medium text-green-600">{workflow.costSavings}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Analytics</CardTitle>
              <CardDescription>Individual agent metrics and efficiency scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agentPerformance.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {agent.tasksCompleted} tasks completed
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-muted-foreground">Efficiency</div>
                        <div className="font-medium">{agent.efficiency}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Uptime</div>
                        <div className="font-medium">{agent.uptime}</div>
                      </div>
                      <Badge variant={agent.efficiency >= 95 ? "default" : "secondary"}>
                        {agent.efficiency >= 95 ? "Excellent" : "Good"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Savings Breakdown</CardTitle>
                <CardDescription>Monthly savings by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Labor Cost Reduction</span>
                    <span className="font-medium text-green-600">$28,400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Error Prevention</span>
                    <span className="font-medium text-green-600">$12,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Time Efficiency</span>
                    <span className="font-medium text-green-600">$5,000</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Monthly Savings</span>
                    <span className="text-green-600">{roiData.totalSavings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Gains</CardTitle>
                <CardDescription>Process improvement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Patient Processing Time</span>
                      <span className="text-sm font-medium">-68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Error Rate Reduction</span>
                      <span className="text-sm font-medium">-84%</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Manual Task Elimination</span>
                      <span className="text-sm font-medium">-92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
