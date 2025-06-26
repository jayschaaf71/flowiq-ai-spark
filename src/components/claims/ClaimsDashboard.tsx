
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";

export const ClaimsDashboard = () => {
  // Mock data for the dashboard
  const metrics = {
    totalClaims: 1247,
    approvedClaims: 1089,
    pendingClaims: 98,
    deniedClaims: 60,
    totalRevenue: 847632.50,
    avgProcessingTime: 3.2,
    approvalRate: 87.3
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClaims.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.approvalRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgProcessingTime} days</div>
            <p className="text-xs text-muted-foreground">
              -0.5 days from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Claims Status Overview</CardTitle>
            <CardDescription>Current status of all claims in the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {metrics.approvedClaims}
                </Badge>
                <span className="text-sm text-gray-500">
                  {((metrics.approvedClaims / metrics.totalClaims) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <Progress value={(metrics.approvedClaims / metrics.totalClaims) * 100} className="h-2" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                  {metrics.pendingClaims}
                </Badge>
                <span className="text-sm text-gray-500">
                  {((metrics.pendingClaims / metrics.totalClaims) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <Progress value={(metrics.pendingClaims / metrics.totalClaims) * 100} className="h-2" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm">Denied</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-red-600 border-red-200">
                  {metrics.deniedClaims}
                </Badge>
                <span className="text-sm text-gray-500">
                  {((metrics.deniedClaims / metrics.totalClaims) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <Progress value={(metrics.deniedClaims / metrics.totalClaims) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest claims processing updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Claims batch processed</p>
                  <p className="text-xs text-gray-600">45 claims approved automatically</p>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Manual review required</p>
                  <p className="text-xs text-gray-600">12 claims need attention</p>
                </div>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Revenue milestone</p>
                  <p className="text-xs text-gray-600">$850K monthly target reached</p>
                </div>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
