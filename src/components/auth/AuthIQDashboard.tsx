import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Users, 
  Shield,
  TrendingUp,
  Zap,
  Calendar,
  FileText
} from "lucide-react";

export const AuthIQDashboard = () => {
  const todayStats = {
    eligibilityChecks: 23,
    priorAuths: 8,
    avgResponseTime: "2.3s",
    successRate: 94.2,
    costSavings: 1250
  };

  const recentActivity = [
    { 
      id: 1, 
      type: "eligibility", 
      patient: "Sarah Johnson", 
      status: "verified", 
      time: "2 min ago",
      insurance: "Aetna PPO"
    },
    { 
      id: 2, 
      type: "prior-auth", 
      patient: "Mike Chen", 
      status: "pending", 
      time: "5 min ago",
      insurance: "Blue Cross"
    },
    { 
      id: 3, 
      type: "cost-estimate", 
      patient: "Lisa Williams", 
      status: "completed", 
      time: "8 min ago",
      insurance: "Cigna"
    },
    { 
      id: 4, 
      type: "eligibility", 
      patient: "David Brown", 
      status: "denied", 
      time: "12 min ago",
      insurance: "UnitedHealth"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "denied":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
      case "completed":
        return <Badge className="bg-green-100 text-green-700">{status}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">{status}</Badge>;
      case "denied":
        return <Badge className="bg-red-100 text-red-700">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Auth iQ Dashboard</h2>
              <p className="text-blue-700">
                Real-time insurance authorization and eligibility verification powered by AI
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">{todayStats.successRate}%</div>
                <div className="text-sm text-blue-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-900">${todayStats.costSavings}</div>
                <div className="text-sm text-green-600">Cost Savings Today</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eligibility Checks</p>
                <p className="text-2xl font-bold">{todayStats.eligibilityChecks}</p>
                <p className="text-xs text-green-600">+12% from yesterday</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prior Authorizations</p>
                <p className="text-2xl font-bold">{todayStats.priorAuths}</p>
                <p className="text-xs text-blue-600">4 pending approval</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">{todayStats.avgResponseTime}</p>
                <p className="text-xs text-green-600">-0.5s improvement</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{todayStats.successRate}%</p>
                <Progress value={todayStats.successRate} className="mt-2" />
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Fast access to common authorization tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-auto flex-col py-4" variant="outline">
              <CheckCircle className="w-6 h-6 mb-2" />
              <span>Verify Eligibility</span>
            </Button>
            <Button className="h-auto flex-col py-4" variant="outline">
              <FileText className="w-6 h-6 mb-2" />
              <span>Submit Prior Auth</span>
            </Button>
            <Button className="h-auto flex-col py-4" variant="outline">
              <DollarSign className="w-6 h-6 mb-2" />
              <span>Generate Cost Estimate</span>
            </Button>
            <Button className="h-auto flex-col py-4" variant="outline">
              <Shield className="w-6 h-6 mb-2" />
              <span>Check Benefits</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest authorization and eligibility activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(activity.status)}
                  <div>
                    <div className="font-medium">{activity.patient}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {activity.type.replace("-", " ")} • {activity.insurance}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(activity.status)}
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insurance Payers Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Connected Insurance Payers
            </CardTitle>
            <CardDescription>
              Real-time API connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Aetna", status: "connected", uptime: "99.9%" },
                { name: "Blue Cross Blue Shield", status: "connected", uptime: "99.7%" },
                { name: "Cigna", status: "connected", uptime: "99.8%" },
                { name: "UnitedHealth", status: "maintenance", uptime: "98.5%" },
                { name: "Humana", status: "connected", uptime: "99.6%" }
              ].map((payer) => (
                <div key={payer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      payer.status === "connected" ? "bg-green-500" : "bg-yellow-500"
                    }`} />
                    <span className="font-medium">{payer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={payer.status === "connected" ? "default" : "secondary"}>
                      {payer.status}
                    </Badge>
                    <span className="text-sm text-gray-500">{payer.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Cost Impact Analysis
            </CardTitle>
            <CardDescription>
              Financial benefits of automated authorization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Time Saved (Today)</span>
                <span className="font-bold">4.2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Labor Cost Savings</span>
                <span className="font-bold text-green-600">$168</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Denied Claims Avoided</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Revenue Protected</span>
                <span className="font-bold text-green-600">$1,082</span>
              </div>
              <hr />
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Total Daily Savings</span>
                <span className="font-bold text-green-600">${todayStats.costSavings}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};