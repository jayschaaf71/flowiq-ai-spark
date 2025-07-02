import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  UserCheck
} from "lucide-react";

export const ReferralDashboard = () => {
  const referralStats = {
    totalReferrals: 156,
    activePhysicians: 28,
    averageConversion: 73,
    pendingOutcomes: 12
  };

  const referralSources = [
    { name: "Sleep Medicine MD", referrals: 89, conversion: 84, avgValue: 2400 },
    { name: "Primary Care", referrals: 45, conversion: 68, avgValue: 1800 },
    { name: "Pulmonology", referrals: 22, conversion: 91, avgValue: 2800 }
  ];

  const recentActivity = [
    { physician: "Dr. Sarah Chen", action: "Sent outcome report", patient: "John Smith", time: "2 hours ago" },
    { physician: "Dr. Mike Johnson", action: "New referral received", patient: "Lisa Williams", time: "4 hours ago" },
    { physician: "Dr. Emily Davis", action: "Portal access granted", patient: "N/A", time: "1 day ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Referral iQ Dashboard</h2>
              <p className="text-blue-700">
                Automated referral network management and physician engagement
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">{referralStats.averageConversion}%</div>
              <div className="text-sm text-blue-600">Avg Conversion</div>
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
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold">{referralStats.totalReferrals}</p>
                <p className="text-xs text-green-600">+12 this month</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active MDs</p>
                <p className="text-2xl font-bold">{referralStats.activePhysicians}</p>
                <p className="text-xs text-green-600">+3 new this quarter</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Outcomes</p>
                <p className="text-2xl font-bold">{referralStats.pendingOutcomes}</p>
                <p className="text-xs text-orange-600">Need attention</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto Reports</p>
                <p className="text-2xl font-bold">47</p>
                <p className="text-xs text-purple-600">sent this month</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Sources Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Referral Source Performance
          </CardTitle>
          <CardDescription>
            Track performance metrics by referring physician specialty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referralSources.map((source) => (
              <div key={source.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{source.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({source.referrals} referrals)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={
                      source.conversion >= 80 ? "bg-green-100 text-green-700" :
                      source.conversion >= 70 ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }>
                      {source.conversion}% conversion
                    </Badge>
                    <span className="text-sm font-medium">${source.avgValue} avg value</span>
                  </div>
                </div>
                <Progress value={source.conversion} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest referral network interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">{activity.physician}</div>
                    <div className="text-sm text-gray-600">{activity.action} • {activity.patient}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common referral management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button className="h-auto flex-col py-4" variant="outline">
                <FileText className="w-6 h-6 mb-2" />
                <span>Send Outcome Report</span>
              </Button>
              <Button className="h-auto flex-col py-4" variant="outline">
                <UserCheck className="w-6 h-6 mb-2" />
                <span>Grant Portal Access</span>
              </Button>
              <Button className="h-auto flex-col py-4" variant="outline">
                <Users className="w-6 h-6 mb-2" />
                <span>Add New Physician</span>
              </Button>
              <Button className="h-auto flex-col py-4" variant="outline">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};