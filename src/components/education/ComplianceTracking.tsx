import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, Filter, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const ComplianceTracking = () => {
  const patients = [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      device: "CPAP", 
      compliance: 92, 
      avgUsage: "7.2h", 
      lastSync: "2 hours ago",
      status: "excellent",
      ahi: 2.1,
      maskLeak: "Low"
    },
    { 
      id: 2, 
      name: "Mike Chen", 
      device: "Oral Appliance", 
      compliance: 45, 
      avgUsage: "3.8h", 
      lastSync: "1 day ago",
      status: "poor",
      ahi: 8.5,
      maskLeak: "N/A"
    },
    { 
      id: 3, 
      name: "Lisa Williams", 
      device: "BiPAP", 
      compliance: 78, 
      avgUsage: "6.1h", 
      lastSync: "30 min ago",
      status: "good",
      ahi: 4.2,
      maskLeak: "Medium"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-700">Excellent</Badge>;
      case "good":
        return <Badge className="bg-blue-100 text-blue-700">Good</Badge>;
      case "fair":
        return <Badge className="bg-yellow-100 text-yellow-700">Fair</Badge>;
      case "poor":
        return <Badge className="bg-red-100 text-red-700">Poor</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "good":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "fair":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "poor":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Patient Compliance Tracking
          </CardTitle>
          <CardDescription>
            Monitor device usage and therapy effectiveness across all patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input 
                placeholder="Search patients..." 
                className="w-full pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Device Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="cpap">CPAP</SelectItem>
                <SelectItem value="oral">Oral Appliance</SelectItem>
                <SelectItem value="bipap">BiPAP</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Compliance Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="excellent">Excellent (&gt;90%)</SelectItem>
                <SelectItem value="good">Good (75-90%)</SelectItem>
                <SelectItem value="fair">Fair (50-75%)</SelectItem>
                <SelectItem value="poor">Poor (&lt;50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">63%</div>
              <div className="text-sm text-gray-600">Excellent Compliance</div>
              <div className="text-xs text-gray-500">&gt;90% usage</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">23%</div>
              <div className="text-sm text-gray-600">Good Compliance</div>
              <div className="text-xs text-gray-500">75-90% usage</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">10%</div>
              <div className="text-sm text-gray-600">Fair Compliance</div>
              <div className="text-xs text-gray-500">50-75% usage</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">4%</div>
              <div className="text-sm text-gray-600">Poor Compliance</div>
              <div className="text-xs text-gray-500">&lt;50% usage</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Compliance Details</CardTitle>
          <CardDescription>
            Individual patient monitoring and intervention opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(patient.status)}
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-600">{patient.device} Device</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(patient.status)}
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Compliance Rate</div>
                    <div className="font-medium">{patient.compliance}%</div>
                    <Progress value={patient.compliance} className="h-1 mt-1" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Avg Usage</div>
                    <div className="font-medium">{patient.avgUsage}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">AHI Score</div>
                    <div className="font-medium">{patient.ahi}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Mask Leak</div>
                    <div className="font-medium">{patient.maskLeak}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Sync</div>
                    <div className="font-medium text-xs">{patient.lastSync}</div>
                  </div>
                </div>

                {patient.compliance < 75 && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Intervention Recommended</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Patient shows poor compliance. Consider scheduling follow-up or adjusting therapy.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">Send Reminder</Button>
                      <Button size="sm" variant="outline">Schedule Call</Button>
                      <Button size="sm" variant="outline">Adjust Settings</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly Compliance Trends
          </CardTitle>
          <CardDescription>
            Track compliance patterns and identify intervention opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            <div className="font-medium">Mon</div>
            <div className="font-medium">Tue</div>
            <div className="font-medium">Wed</div>
            <div className="font-medium">Thu</div>
            <div className="font-medium">Fri</div>
            <div className="font-medium">Sat</div>
            <div className="font-medium">Sun</div>
            
            <div className="bg-green-100 text-green-800 p-2 rounded">89%</div>
            <div className="bg-green-100 text-green-800 p-2 rounded">92%</div>
            <div className="bg-green-100 text-green-800 p-2 rounded">87%</div>
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded">76%</div>
            <div className="bg-red-100 text-red-800 p-2 rounded">65%</div>
            <div className="bg-red-100 text-red-800 p-2 rounded">58%</div>
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded">71%</div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Weekend compliance typically drops 15-20%. Consider targeted weekend reminders.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};