
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Receipt, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  FileText,
  Brain,
  Shield,
  Zap,
  Activity,
  Eye,
  RefreshCw,
  Send
} from "lucide-react";

const ClaimsIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data for the dashboard
  const dashboardStats = [
    { label: "Clean Claim Rate", value: "94.2%", icon: CheckCircle, trend: "+5.8%", color: "text-green-600" },
    { label: "Avg Processing Time", value: "7 min", icon: Clock, trend: "-65%", color: "text-blue-600" },
    { label: "Outstanding A/R", value: "$47,320", icon: DollarSign, trend: "-23%", color: "text-purple-600" },
    { label: "Denial Rate", value: "3.1%", icon: AlertTriangle, trend: "-58%", color: "text-orange-600" }
  ];

  const recentClaims = [
    { id: "CLM-2024-001", patient: "Sarah Johnson", amount: "$350.00", status: "submitted", payer: "Aetna", date: "2024-01-15" },
    { id: "CLM-2024-002", patient: "Mike Wilson", amount: "$125.50", status: "paid", payer: "BCBS", date: "2024-01-14" },
    { id: "CLM-2024-003", patient: "Emma Davis", amount: "$275.00", status: "processing", payer: "Cigna", date: "2024-01-13" },
    { id: "CLM-2024-004", patient: "John Smith", amount: "$450.00", status: "denied", payer: "UHC", date: "2024-01-12" }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      submitted: { variant: "secondary" as const, color: "bg-blue-100 text-blue-700" },
      paid: { variant: "default" as const, color: "bg-green-100 text-green-700" },
      processing: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-700" },
      denied: { variant: "destructive" as const, color: "bg-red-100 text-red-700" }
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants]?.variant || "secondary"} 
             className={variants[status as keyof typeof variants]?.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Claims iQ"
        subtitle="AI-powered insurance claims processing and revenue cycle management"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="claims">Claims Queue</TabsTrigger>
            <TabsTrigger value="coding">AI Coding</TabsTrigger>
            <TabsTrigger value="denials">Denial Mgmt</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend} from last month
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col gap-2">
                    <Brain className="w-6 h-6" />
                    Generate Claims
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Eye className="w-6 h-6" />
                    Review Queue
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <RefreshCw className="w-6 h-6" />
                    Check Status
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Send className="w-6 h-6" />
                    Bulk Submit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Claims */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Claims Activity</CardTitle>
                <CardDescription>Latest claims processed by Claims iQ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentClaims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{claim.id}</p>
                          <p className="text-sm text-muted-foreground">{claim.patient}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{claim.amount}</p>
                          <p className="text-xs text-muted-foreground">{claim.payer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(claim.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Claims Processing Queue
                </CardTitle>
                <CardDescription>
                  Automated claim generation and submission pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Processing Pipeline */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Ready to Process</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">23</div>
                      <p className="text-xs text-blue-600">New visits</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-yellow-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium">AI Processing</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">8</div>
                      <p className="text-xs text-yellow-600">Being coded</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-orange-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">Review Required</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <p className="text-xs text-orange-600">Manual review</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Send className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Ready to Submit</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">15</div>
                      <p className="text-xs text-green-600">Clean claims</p>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing Progress</span>
                      <span>87% Complete</span>
                    </div>
                    <Progress value={87} className="w-full" />
                  </div>

                  {/* Batch Actions */}
                  <div className="flex gap-2">
                    <Button>
                      <Brain className="w-4 h-4 mr-2" />
                      Process All
                    </Button>
                    <Button variant="outline">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Ready Claims
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Review Flagged
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Medical Coding Engine
                </CardTitle>
                <CardDescription>
                  Automated CPT, ICD-10, and HCPCS code assignment with confidence scoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Coding Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">96.8%</div>
                      <p className="text-sm text-muted-foreground">Coding Accuracy</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2,847</div>
                      <p className="text-sm text-muted-foreground">Codes Assigned Today</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">4.2 sec</div>
                      <p className="text-sm text-muted-foreground">Avg Coding Time</p>
                    </div>
                  </div>

                  {/* Recent Coding Activity */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Recent Coding Activity</h3>
                    <div className="space-y-3">
                      {[
                        { procedure: "Routine Dental Cleaning", codes: "D1110", confidence: 98 },
                        { procedure: "Composite Filling - 2 Surfaces", codes: "D2392", confidence: 95 },
                        { procedure: "Periodontal Scaling", codes: "D4341", confidence: 92 },
                        { procedure: "Crown Prep & Temp", codes: "D2740, D2799", confidence: 89 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.procedure}</p>
                            <p className="text-sm text-muted-foreground">Codes: {item.codes}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-sm font-medium">{item.confidence}%</p>
                              <p className="text-xs text-muted-foreground">Confidence</p>
                            </div>
                            <Progress value={item.confidence} className="w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="denials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Intelligent Denial Management
                </CardTitle>
                <CardDescription>
                  Automated denial analysis, correction, and resubmission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Denial Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg bg-red-50">
                      <div className="text-2xl font-bold text-red-600">12</div>
                      <p className="text-sm text-red-600">New Denials</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-yellow-50">
                      <div className="text-2xl font-bold text-yellow-600">8</div>
                      <p className="text-sm text-yellow-600">Under Review</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold text-blue-600">15</div>
                      <p className="text-sm text-blue-600">Ready to Resubmit</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="text-2xl font-bold text-green-600">23</div>
                      <p className="text-sm text-green-600">Resolved This Week</p>
                    </div>
                  </div>

                  {/* Common Denial Reasons */}
                  <div>
                    <h3 className="font-medium mb-3">Top Denial Reasons</h3>
                    <div className="space-y-2">
                      {[
                        { reason: "Missing Prior Authorization", count: 8, trend: "-12%" },
                        { reason: "Incorrect Patient Information", count: 6, trend: "-25%" },
                        { reason: "Procedure Not Covered", count: 4, trend: "+5%" },
                        { reason: "Duplicate Claim", count: 3, trend: "-40%" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.reason}</p>
                            <p className="text-sm text-muted-foreground">{item.count} occurrences</p>
                          </div>
                          <Badge variant={item.trend.startsWith('-') ? 'default' : 'destructive'}>
                            {item.trend}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Process Denials
                    </Button>
                    <Button variant="outline">
                      <Send className="w-4 h-4 mr-2" />
                      Resubmit Ready
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Revenue Intelligence Dashboard
                </CardTitle>
                <CardDescription>
                  Comprehensive analytics and predictive insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Revenue Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">$127,450</div>
                      <p className="text-sm text-muted-foreground">Monthly Collections</p>
                      <p className="text-xs text-green-600">+18% vs last month</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">16.8 days</div>
                      <p className="text-sm text-muted-foreground">Avg Days in A/R</p>
                      <p className="text-xs text-green-600">-28 days improvement</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">$8,320</div>
                      <p className="text-sm text-muted-foreground">Predicted Next Week</p>
                      <p className="text-xs text-purple-600">AI Forecast</p>
                    </div>
                  </div>

                  {/* Payer Performance */}
                  <div>
                    <h3 className="font-medium mb-3">Payer Performance</h3>
                    <div className="space-y-3">
                      {[
                        { payer: "Blue Cross Blue Shield", rate: 96, days: 12, amount: "$45,230" },
                        { payer: "Aetna", rate: 94, days: 15, amount: "$32,150" },
                        { payer: "Cigna", rate: 91, days: 18, amount: "$28,670" },
                        { payer: "United Healthcare", rate: 89, days: 22, amount: "$21,400" }
                      ].map((payer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{payer.payer}</p>
                            <p className="text-sm text-muted-foreground">{payer.amount} collected</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{payer.rate}%</p>
                              <p className="text-xs text-muted-foreground">Success Rate</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{payer.days} days</p>
                              <p className="text-xs text-muted-foreground">Avg Payment</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-600" />
                  Claims iQ Configuration
                </CardTitle>
                <CardDescription>
                  Configure AI models, integrations, and workflow preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Integration Status */}
                  <div>
                    <h3 className="font-medium mb-3">System Integrations</h3>
                    <div className="space-y-3">
                      {[
                        { name: "EHR System", status: "connected", type: "Dentrix Enterprise" },
                        { name: "Clearinghouse", status: "connected", type: "Availity" },
                        { name: "Practice Management", status: "connected", type: "Eaglesoft" },
                        { name: "Payment Processor", status: "pending", type: "Stripe" }
                      ].map((integration, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <p className="text-sm text-muted-foreground">{integration.type}</p>
                          </div>
                          <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                            {integration.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Model Settings */}
                  <div>
                    <h3 className="font-medium mb-3">AI Model Configuration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Coding Confidence Threshold</p>
                          <p className="text-sm text-muted-foreground">Minimum confidence for auto-approval</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">85%</p>
                          <Button variant="outline" size="sm">Adjust</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Auto-Submit Clean Claims</p>
                          <p className="text-sm text-muted-foreground">Automatically submit high-confidence claims</p>
                        </div>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClaimsIQ;
