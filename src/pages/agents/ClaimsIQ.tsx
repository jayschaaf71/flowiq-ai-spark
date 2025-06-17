
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Receipt, 
  FileCheck, 
  AlertTriangle, 
  DollarSign, 
  Clock,
  CheckCircle,
  TrendingUp,
  Settings,
  Upload,
  Download
} from "lucide-react";

const ClaimsIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = {
    claimsSubmitted: 67,
    approvalRate: 94,
    totalValue: 89450,
    pendingReview: 8,
    denialRate: 6,
    avgProcessing: 5.2
  };

  const recentClaims = [
    { claimId: "CLM-2024-001", patient: "Sarah Wilson", amount: 1250, status: "approved", insurer: "BlueCross", time: "2 hours ago" },
    { claimId: "CLM-2024-002", patient: "John Doe", amount: 880, status: "pending", insurer: "Aetna", time: "4 hours ago" },
    { claimId: "CLM-2024-003", patient: "Mary Johnson", amount: 2100, status: "approved", insurer: "Cigna", time: "6 hours ago" },
    { claimId: "CLM-2024-004", patient: "Robert Smith", amount: 750, status: "denied", insurer: "UnitedHealth", time: "1 day ago" },
    { claimId: "CLM-2024-005", patient: "Lisa Brown", amount: 420, status: "processing", insurer: "BlueCross", time: "1 day ago" }
  ];

  const denialReasons = [
    { reason: "Incomplete Documentation", count: 3, percentage: 50 },
    { reason: "Prior Authorization Required", count: 2, percentage: 33 },
    { reason: "Service Not Covered", count: 1, percentage: 17 }
  ];

  const insurerPerformance = [
    { insurer: "BlueCross", submitted: 25, approved: 24, rate: 96, avgDays: 4.2 },
    { insurer: "Aetna", submitted: 18, approved: 16, rate: 89, avgDays: 6.1 },
    { insurer: "Cigna", submitted: 15, approved: 14, rate: 93, avgDays: 5.8 },
    { insurer: "UnitedHealth", submitted: 9, approved: 8, rate: 89, avgDays: 7.3 }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Claims iQ"
        subtitle="Automated insurance claims processing"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Claims Submitted</CardTitle>
              <Receipt className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.claimsSubmitted}</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approvalRate}%</div>
              <Progress value={stats.approvalRate} className="h-1 mt-1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${stats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</div>
              <p className="text-xs text-muted-foreground">claims</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Denial Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.denialRate}%</div>
              <p className="text-xs text-muted-foreground">industry avg: 12%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgProcessing} days</div>
              <p className="text-xs text-muted-foreground">faster than manual</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="claims">Claims</TabsTrigger>
              <TabsTrigger value="denials">Denials</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Upload className="w-4 h-4 mr-2" />
                Submit Claims
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Claims */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentClaims.map((claim, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{claim.claimId}</div>
                          <div className="text-xs text-muted-foreground">
                            {claim.patient} • ${claim.amount} • {claim.insurer} • {claim.time}
                          </div>
                        </div>
                        <Badge 
                          className={
                            claim.status === "approved" ? "bg-green-100 text-green-800" :
                            claim.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            claim.status === "denied" ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                          }
                        >
                          {claim.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Denial Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Denial Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {denialReasons.map((denial, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{denial.reason}</span>
                          <Badge variant="outline">{denial.count}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={denial.percentage} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground">{denial.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insurer Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Insurer Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {insurerPerformance.map((insurer, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="text-sm font-medium mb-2">{insurer.insurer}</div>
                      <div className="text-2xl font-bold mb-1">{insurer.rate}%</div>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={insurer.rate} className="flex-1 h-2" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {insurer.approved}/{insurer.submitted} approved • {insurer.avgDays} days avg
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
                <CardTitle>Claims Management</CardTitle>
                <CardDescription>Submit and track insurance claims</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt className="w-12 h-12 mx-auto mb-4" />
                  <p>Claims management interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="denials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Denial Management</CardTitle>
                <CardDescription>Handle claim denials and resubmissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>Denial management interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Claims Analytics</CardTitle>
                <CardDescription>Performance metrics and financial insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClaimsIQ;
