
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  CreditCard,
  Receipt,
  Calculator
} from "lucide-react";

export const BillingDashboard = () => {
  const stats = {
    totalRevenue: 87420,
    invoicesGenerated: 156,
    collectionRate: 94,
    pendingClaims: 23
  };

  const recentActivity = [
    { time: "5 min ago", action: "Generated invoice for patient #4829", amount: 245.00, type: "invoice" },
    { time: "12 min ago", action: "Insurance claim approved - BlueCross", amount: 180.00, type: "claim" },
    { time: "18 min ago", action: "Payment processed - Credit Card", amount: 125.00, type: "payment" },
    { time: "25 min ago", action: "Sent payment reminder to 8 patients", amount: null, type: "reminder" },
    { time: "32 min ago", action: "Auto-coded 5 procedures from visit notes", amount: null, type: "coding" }
  ];

  const pendingTasks = [
    { task: "Review 12 rejected claims", priority: "high" as const, eta: "30 min" },
    { task: "Process batch payments (15 items)", priority: "medium" as const, eta: "1 hour" },
    { task: "Generate monthly billing report", priority: "low" as const, eta: "2 hours" },
    { task: "Update insurance fee schedules", priority: "medium" as const, eta: "45 min" }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "invoice": return <FileText className="w-4 h-4 text-blue-600" />;
      case "claim": return <Receipt className="w-4 h-4 text-green-600" />;
      case "payment": return <CreditCard className="w-4 h-4 text-purple-600" />;
      case "reminder": return <Clock className="w-4 h-4 text-amber-600" />;
      case "coding": return <Calculator className="w-4 h-4 text-emerald-600" />;
      default: return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Today</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Invoices Generated</p>
                <p className="text-2xl font-bold">{stats.invoicesGenerated}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold">{stats.collectionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <Progress value={stats.collectionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Claims</p>
                <p className="text-2xl font-bold">{stats.pendingClaims}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest billing and payment processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <Badge className="bg-green-100 text-green-700">
                      ${activity.amount.toFixed(2)}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-muted-foreground">ETA: {task.eta}</p>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common billing management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="w-5 h-5" />
              <span className="text-sm">Generate Invoice</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Receipt className="w-5 h-5" />
              <span className="text-sm">Submit Claims</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm">Process Payments</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
