import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MessageSquare,
  Smartphone
} from "lucide-react";

export const EducationDashboard = () => {
  const complianceStats = {
    averageCompliance: 78,
    activePatients: 156,
    lowCompliance: 23,
    excellentCompliance: 98
  };

  const deviceTypes = [
    { name: "CPAP Machines", patients: 89, avgCompliance: 82 },
    { name: "Oral Appliances", patients: 45, avgCompliance: 91 },
    { name: "BiPAP Devices", patients: 22, avgCompliance: 75 }
  ];

  const recentAlerts = [
    { patient: "John Smith", device: "CPAP", issue: "Usage below 4 hrs/night", time: "2 hours ago" },
    { patient: "Mary Johnson", device: "Oral Appliance", issue: "Missed 3 consecutive nights", time: "1 day ago" },
    { patient: "Robert Davis", device: "BiPAP", issue: "Mask leak detected", time: "6 hours ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Education iQ Dashboard</h2>
              <p className="text-purple-700">
                Patient education and compliance monitoring powered by AI
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-900">{complianceStats.averageCompliance}%</div>
              <div className="text-sm text-purple-600">Average Compliance</div>
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
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-2xl font-bold">{complianceStats.activePatients}</p>
                <p className="text-xs text-green-600">+8 this week</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Excellent Compliance</p>
                <p className="text-2xl font-bold">{complianceStats.excellentCompliance}</p>
                <p className="text-xs text-green-600">&gt;90% usage rate</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold">{complianceStats.lowCompliance}</p>
                <p className="text-xs text-red-600">&lt;75% compliance</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Usage</p>
                <p className="text-2xl font-bold">6.8h</p>
                <p className="text-xs text-blue-600">per night</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Compliance by Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Compliance by Device Type
          </CardTitle>
          <CardDescription>
            Track patient compliance across different sleep therapy devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deviceTypes.map((device) => (
              <div key={device.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{device.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({device.patients} patients)</span>
                  </div>
                  <Badge className={
                    device.avgCompliance >= 90 ? "bg-green-100 text-green-700" :
                    device.avgCompliance >= 75 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }>
                    {device.avgCompliance}%
                  </Badge>
                </div>
                <Progress value={device.avgCompliance} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Compliance Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Patients requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">{alert.patient}</div>
                    <div className="text-sm text-gray-600">{alert.device} • {alert.issue}</div>
                    <div className="text-xs text-gray-500">{alert.time}</div>
                  </div>
                  <Button size="sm" variant="outline">
                    Contact
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common educational and engagement tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button className="h-auto flex-col py-4" variant="outline">
                <Smartphone className="w-6 h-6 mb-2" />
                <span>Send Usage Reminder</span>
              </Button>
              <Button className="h-auto flex-col py-4" variant="outline">
                <Heart className="w-6 h-6 mb-2" />
                <span>Schedule Check-in</span>
              </Button>
              <Button className="h-auto flex-col py-4" variant="outline">
                <MessageSquare className="w-6 h-6 mb-2" />
                <span>Create Campaign</span>
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