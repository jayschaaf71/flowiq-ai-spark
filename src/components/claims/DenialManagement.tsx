
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  Eye, 
  FileText, 
  TrendingDown,
  CheckCircle,
  Clock
} from "lucide-react";

interface Denial {
  id: string;
  claimId: string;
  patient: string;
  amount: number;
  payer: string;
  denialReason: string;
  denialCode: string;
  dateReceived: string;
  status: 'new' | 'reviewing' | 'correcting' | 'appealing' | 'resolved';
  aiRecommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export const DenialManagement = () => {
  const [denials, setDenials] = useState<Denial[]>([
    {
      id: "DN-001",
      claimId: "CLM-2024-001",
      patient: "Sarah Johnson",
      amount: 350.00,
      payer: "Aetna",
      denialReason: "Prior Authorization Required",
      denialCode: "50",
      dateReceived: "2024-01-20",
      status: "new",
      aiRecommendation: "Obtain prior authorization and resubmit within 30 days",
      priority: "high"
    },
    {
      id: "DN-002",
      claimId: "CLM-2024-005",
      patient: "Mike Wilson",
      amount: 275.50,
      payer: "BCBS",
      denialReason: "Incorrect Patient Information",
      denialCode: "12",
      dateReceived: "2024-01-19",
      status: "correcting",
      aiRecommendation: "Update patient DOB and resubmit immediately",
      priority: "medium"
    }
  ]);

  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { variant: "destructive" as const, color: "bg-red-100 text-red-700" },
      reviewing: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-700" },
      correcting: { variant: "secondary" as const, color: "bg-blue-100 text-blue-700" },
      appealing: { variant: "secondary" as const, color: "bg-purple-100 text-purple-700" },
      resolved: { variant: "default" as const, color: "bg-green-100 text-green-700" }
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants]?.variant || "secondary"} 
             className={variants[status as keyof typeof variants]?.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { variant: "destructive" as const, color: "bg-red-100 text-red-700" },
      medium: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-700" },
      low: { variant: "outline" as const, color: "bg-gray-100 text-gray-700" }
    };
    
    return (
      <Badge variant={variants[priority as keyof typeof variants]?.variant || "outline"} 
             className={variants[priority as keyof typeof variants]?.color}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const handleProcessDenial = (denialId: string) => {
    setDenials(prev => prev.map(denial =>
      denial.id === denialId ? { ...denial, status: 'correcting' as const } : denial
    ));
    toast({
      title: "Denial Processing Started",
      description: "AI is analyzing the denial and preparing corrections",
    });
  };

  const handleAppealDenial = (denialId: string) => {
    setDenials(prev => prev.map(denial =>
      denial.id === denialId ? { ...denial, status: 'appealing' as const } : denial
    ));
    toast({
      title: "Appeal Initiated",
      description: "Automated appeal has been generated and submitted",
    });
  };

  const denialStats = [
    { label: "New Denials", value: 12, icon: AlertTriangle, color: "text-red-600" },
    { label: "In Progress", value: 8, icon: RefreshCw, color: "text-yellow-600" },
    { label: "Resolved This Week", value: 23, icon: CheckCircle, color: "text-green-600" },
    { label: "Avg Resolution Time", value: "3.2 days", icon: Clock, color: "text-blue-600" }
  ];

  const commonDenialReasons = [
    { reason: "Prior Authorization Required", count: 8, trend: "-12%", autoFix: true },
    { reason: "Incorrect Patient Information", count: 6, trend: "-25%", autoFix: true },
    { reason: "Procedure Not Covered", count: 4, trend: "+5%", autoFix: false },
    { reason: "Duplicate Claim", count: 3, trend: "-40%", autoFix: true }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {denialStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Denials</TabsTrigger>
          <TabsTrigger value="patterns">Denial Patterns</TabsTrigger>
          <TabsTrigger value="appeals">Appeals Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Denials</CardTitle>
                  <CardDescription>Review and process denied claims</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Review All
                  </Button>
                  <Button size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Auto-Process
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {denials.map((denial) => (
                  <div key={denial.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{denial.patient}</h3>
                          {getPriorityBadge(denial.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Claim {denial.claimId} • ${denial.amount.toFixed(2)} • {denial.payer}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(denial.status)}
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-800">
                          {denial.denialReason} (Code: {denial.denialCode})
                        </span>
                      </div>
                      <p className="text-sm text-red-700">
                        Received: {denial.dateReceived}
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">AI Recommendation</span>
                      </div>
                      <p className="text-sm text-blue-700">{denial.aiRecommendation}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleProcessDenial(denial.id)}
                        disabled={denial.status !== 'new'}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Auto-Correct
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAppealDenial(denial.id)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Appeal
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-orange-600" />
                Denial Pattern Analysis
              </CardTitle>
              <CardDescription>
                Identify recurring denial reasons and prevention opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">Common Denial Reasons</h3>
                {commonDenialReasons.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{item.reason}</p>
                        {item.autoFix && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            Auto-Fixable
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.count} occurrences this month</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={item.trend.startsWith('-') ? 'default' : 'destructive'}>
                        {item.trend}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appeals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appeals Tracking</CardTitle>
              <CardDescription>Monitor the status of submitted appeals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>Appeals tracking dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
