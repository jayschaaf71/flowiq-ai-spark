import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Zap,
  Bot,
  FileText,
  BarChart3
} from "lucide-react";

const OpsIQ = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Ops iQ"
        subtitle="AI-powered practice operations optimization and management"
        badge="AI"
      />
      
      {/* AI Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Optimization Score</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
            <Progress value={87} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 scheduled for deployment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">
              Across all processes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Operations Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Optimization
            </CardTitle>
            <CardDescription>
              AI-powered scheduling recommendations and automation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Appointment Buffer Optimization</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Provider Workload Balancing</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">No-Show Prediction & Prevention</span>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
            </div>
            <Button className="w-full">Configure Schedule Rules</Button>
          </CardContent>
        </Card>

        {/* Staff Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Staff Productivity
            </CardTitle>
            <CardDescription>
              Team performance monitoring and optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Task Automation</span>
                <span className="text-sm text-muted-foreground">8 active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Workflow Optimization</span>
                <span className="text-sm text-muted-foreground">94% efficiency</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Training Recommendations</span>
                <Badge variant="outline">2 pending</Badge>
              </div>
            </div>
            <Button className="w-full">View Staff Analytics</Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Data-driven recommendations to improve practice operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Optimize Tuesday Scheduling</h4>
                <p className="text-sm text-muted-foreground">
                  Add 2 more initial consultation slots on Tuesdays to reduce wait times by 18%
                </p>
                <Button size="sm" className="mt-2">Implement</Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Provider Workload Imbalance</h4>
                <p className="text-sm text-muted-foreground">
                  Dr. Johnson has 30% more appointments than average this week
                </p>
                <Button size="sm" variant="outline" className="mt-2">Rebalance</Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Automation Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  Automate insurance verification reminders to save 45 minutes daily
                </p>
                <Button size="sm" variant="outline" className="mt-2">Set Up</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Process Analytics</h3>
                <p className="text-sm text-muted-foreground">View detailed workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Operation Reports</h3>
                <p className="text-sm text-muted-foreground">Generate insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">AI Configuration</h3>
                <p className="text-sm text-muted-foreground">Customize automation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpsIQ;