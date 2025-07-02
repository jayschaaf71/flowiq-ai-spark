import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Search,
  Filter,
  FileText,
  Phone,
  Mail
} from "lucide-react";

export const ReferralTracking = () => {
  const leadSources = [
    { 
      source: "Dr. Sarah Chen (Sleep MD)",
      referrals: 34,
      conversions: 28,
      revenue: 67200,
      avgValue: 2400,
      trend: "+12%"
    },
    { 
      source: "Dr. Mike Johnson (Primary Care)",
      referrals: 18,
      conversions: 12,
      revenue: 21600,
      avgValue: 1800,
      trend: "+8%"
    },
    { 
      source: "Dr. Emily Davis (Pulmonology)",
      referrals: 12,
      conversions: 11,
      revenue: 30800,
      avgValue: 2800,
      trend: "+22%"
    }
  ];

  const recentReferrals = [
    {
      id: 1,
      patient: "John Smith",
      referringMD: "Dr. Sarah Chen",
      source: "Sleep Medicine",
      date: "2024-02-15",
      status: "converted",
      value: 2400,
      contact: "Initial consult completed"
    },
    {
      id: 2,
      patient: "Lisa Williams",
      referringMD: "Dr. Mike Johnson",
      source: "Primary Care",
      date: "2024-02-14",
      status: "scheduled",
      value: 1800,
      contact: "Appointment scheduled for next week"
    },
    {
      id: 3,
      patient: "Robert Davis",
      referringMD: "Dr. Emily Davis",
      source: "Pulmonology",
      date: "2024-02-13",
      status: "pending",
      value: 2800,
      contact: "Awaiting insurance verification"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "converted":
        return <Badge className="bg-green-100 text-green-700">Converted</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "lost":
        return <Badge className="bg-red-100 text-red-700">Lost</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Lead Source Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Referral Lead Source Tracking
          </CardTitle>
          <CardDescription>
            Track the performance and ROI of different referral sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leadSources.map((source, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{source.source}</h3>
                    <p className="text-sm text-gray-600">
                      {source.referrals} referrals • {source.conversions} conversions
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {source.trend} this quarter
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                    <div className="font-semibold">
                      {Math.round((source.conversions / source.referrals) * 100)}%
                    </div>
                    <Progress 
                      value={(source.conversions / source.referrals) * 100} 
                      className="h-1 mt-1" 
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                    <div className="font-semibold text-green-600">
                      ${source.revenue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Avg Deal Value</div>
                    <div className="font-semibold">
                      ${source.avgValue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">ROI</div>
                    <div className="font-semibold text-blue-600">485%</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-1" />
                    Contact MD
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-1" />
                    Send Thank You
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold">64</p>
                <p className="text-xs text-green-600">+18% vs last quarter</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-green-600">Above target (75%)</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Referral Revenue</p>
                <p className="text-2xl font-bold">$119K</p>
                <p className="text-xs text-green-600">+24% growth</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Time to Convert</p>
                <p className="text-2xl font-bold">8.5d</p>
                <p className="text-xs text-blue-600">Under target (10d)</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referral Activity</CardTitle>
          <CardDescription>
            Track individual referrals and their conversion status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input 
                placeholder="Search referrals..." 
                className="w-full pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="sleep">Sleep Medicine</SelectItem>
                <SelectItem value="primary">Primary Care</SelectItem>
                <SelectItem value="pulmonology">Pulmonology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {recentReferrals.map((referral) => (
              <div key={referral.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{referral.patient}</div>
                    <div className="text-sm text-gray-600">
                      Referred by {referral.referringMD} • {referral.source}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(referral.status)}
                    <div className="text-right text-sm">
                      <div className="font-medium">${referral.value.toLocaleString()}</div>
                      <div className="text-gray-600">{referral.date}</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  Latest: {referral.contact}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-1" />
                    Follow Up
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-1" />
                    Send Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};