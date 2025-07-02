import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Send, 
  Download, 
  Eye,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp
} from "lucide-react";

export const OutcomeSummaries = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const outcomeSummaries = [
    {
      id: 1,
      patient: "John Smith",
      referringMD: "Dr. Sarah Chen",
      referralDate: "2024-01-15",
      treatmentDate: "2024-02-01",
      device: "Oral Appliance",
      preAHI: 18.5,
      postAHI: 3.2,
      compliance: 94,
      status: "sent",
      sentDate: "2024-02-15"
    },
    {
      id: 2,
      patient: "Lisa Williams",
      referringMD: "Dr. Mike Johnson",
      referralDate: "2024-01-20",
      treatmentDate: "2024-02-05",
      device: "CPAP Machine",
      preAHI: 24.8,
      postAHI: 2.1,
      compliance: 87,
      status: "pending",
      sentDate: null
    },
    {
      id: 3,
      patient: "Robert Davis",
      referringMD: "Dr. Emily Davis",
      referralDate: "2024-01-25",
      treatmentDate: "2024-02-10",
      device: "BiPAP Device",
      preAHI: 32.1,
      postAHI: 4.8,
      compliance: 91,
      status: "draft",
      sentDate: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-100 text-green-700">Sent</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getOutcomeIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "draft":
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const calculateImprovement = (preAHI: number, postAHI: number) => {
    return Math.round(((preAHI - postAHI) / preAHI) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-green-600">+12 this month</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto Sent</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-green-600">57% automated</p>
              </div>
              <Send className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg AHI Reduction</p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-blue-600">treatment success</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-orange-600">need attention</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Outcome Reports Management
          </CardTitle>
          <CardDescription>
            Generate and send automated outcome summaries to referring physicians
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <Input 
                placeholder="Search patients or physicians..." 
                className="w-full"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {outcomeSummaries.map((summary) => (
              <div key={summary.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {getOutcomeIcon(summary.status)}
                    <div>
                      <div className="font-medium">{summary.patient}</div>
                      <div className="text-sm text-gray-600">
                        Referred by {summary.referringMD} • {summary.device}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(summary.status)}
                    <div className="text-right text-sm">
                      <div className="text-gray-600">
                        {summary.sentDate ? `Sent ${summary.sentDate}` : 'Not sent'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Referral Date</div>
                    <div className="font-medium text-xs">{summary.referralDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Pre-Treatment AHI</div>
                    <div className="font-medium">{summary.preAHI}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Post-Treatment AHI</div>
                    <div className="font-medium text-green-600">{summary.postAHI}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">AHI Improvement</div>
                    <div className="font-medium text-blue-600">
                      {calculateImprovement(summary.preAHI, summary.postAHI)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Compliance</div>
                    <div className="font-medium">{summary.compliance}%</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  {summary.status === "draft" && (
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  {summary.status !== "sent" && (
                    <Button size="sm">
                      <Send className="w-4 h-4 mr-1" />
                      Send Report
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Send Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Auto-Send Configuration
          </CardTitle>
          <CardDescription>
            Configure automatic outcome report generation and delivery schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">30-Day Follow-up</h4>
                  <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Automatically send outcome reports 30 days after treatment
                </p>
                <Button size="sm" variant="outline">Configure</Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">90-Day Assessment</h4>
                  <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Send comprehensive outcome reports at 90-day mark
                </p>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Annual Summary</h4>
                  <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Send annual outcome summaries to referring physicians
                </p>
                <Button size="sm" variant="outline">Configure</Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Custom Triggers</h4>
                  <Badge className="bg-gray-100 text-gray-700">Disabled</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Set custom conditions for automatic report generation
                </p>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};