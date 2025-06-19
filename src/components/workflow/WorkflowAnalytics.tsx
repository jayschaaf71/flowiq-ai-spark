
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  BarChart3 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export const WorkflowAnalytics = () => {
  const workflowStats = [
    {
      title: "Active Workflows",
      value: "24",
      change: "+8%",
      icon: Zap,
      color: "text-blue-600"
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+5%",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Avg Execution Time",
      value: "2.3s",
      change: "-12%",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Error Rate",
      value: "0.8%",
      change: "-3%",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  const executionData = [
    { date: '2024-01-15', executions: 342, errors: 8 },
    { date: '2024-01-16', executions: 389, errors: 5 },
    { date: '2024-01-17', executions: 267, errors: 12 },
    { date: '2024-01-18', executions: 445, errors: 3 },
    { date: '2024-01-19', executions: 398, errors: 7 },
    { date: '2024-01-20', executions: 512, errors: 2 },
    { date: '2024-01-21', executions: 423, errors: 4 }
  ];

  const workflowPerformance = [
    {
      name: "Patient Intake Automation",
      executions: 1247,
      successRate: 98.5,
      avgTime: "1.8s",
      status: "active"
    },
    {
      name: "Appointment Reminder Flow",
      executions: 892,
      successRate: 99.2,
      avgTime: "0.9s",
      status: "active"
    },
    {
      name: "SOAP Note Processing",
      executions: 567,
      successRate: 94.3,
      avgTime: "3.2s",
      status: "active"
    },
    {
      name: "Insurance Verification",
      executions: 334,
      successRate: 89.7,
      avgTime: "5.1s",
      status: "warning"
    },
    {
      name: "Billing Code Assignment",
      executions: 278,
      successRate: 96.8,
      avgTime: "2.1s", 
      status: "active"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workflowStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last week
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daily Executions
            </CardTitle>
            <CardDescription>Workflow executions over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Bar dataKey="executions" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Error Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Error Trends
            </CardTitle>
            <CardDescription>Daily error count and trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="errors" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Performance</CardTitle>
          <CardDescription>Individual workflow metrics and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflowPerformance.map((workflow, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{workflow.name}</h4>
                  <Badge 
                    variant={workflow.status === 'active' ? 'default' : 'secondary'}
                    className={workflow.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                  >
                    {workflow.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Executions</p>
                    <p className="font-semibold">{workflow.executions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="font-semibold">{workflow.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Time</p>
                    <p className="font-semibold">{workflow.avgTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Performance</p>
                    <Progress 
                      value={workflow.successRate} 
                      className="w-full mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
