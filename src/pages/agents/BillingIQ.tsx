
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
  Refresh,
  Download
} from "lucide-react";

const BillingIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = {
    invoicesProcessed: 89,
    totalRevenue: 45280,
    verificationRate: 96,
    pendingClaims: 12,
    automatedBilling: 87,
    averagePayment: 14
  };

  const recentTransactions = [
    { patient: "Sarah Wilson", amount: 350, service: "Annual Checkup", status: "paid", time: "1 hour ago" },
    { patient: "John Doe", amount: 180, service: "Lab Work", status: "pending", time: "3 hours ago" },
    { patient: "Mary Johnson", amount: 220, service: "Consultation", status: "paid", time: "5 hours ago" },
    { patient: "Robert Smith", amount: 450, service: "Procedure", status: "processing", time: "1 day ago" },
    { patient: "Lisa Brown", amount: 125, service: "Follow-up", status: "paid", time: "2 days ago" }
  ];

  const insuranceVerifications = [
    { patient: "Emily Davis", insurance: "BlueCross", status: "verified", coverage: "Active", time: "10 min ago" },
    { patient: "Michael Lee", insurance: "Aetna", status: "pending", coverage: "Checking", time: "25 min ago" },
    { patient: "Jessica Wang", insurance: "Cigna", status: "verified", coverage: "Active", time: "45 min ago" },
    { patient: "David Chen", insurance: "UnitedHealth", status: "failed", coverage: "Inactive", time: "1 hour ago" }
  ];

  const paymentMethods = [
    { method: "Credit Card", percentage: 65, amount: 29432 },
    { method: "Insurance", percentage: 28, amount: 12678 },
    { method: "Cash", percentage: 5, amount: 2264 },
    { method: "Payment Plan", percentage: 2, amount: 906 }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Billing iQ"
        subtitle="Intelligent billing and insurance verification"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invoices Today</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.invoicesProcessed}</div>
              <p className="text-xs text-muted-foreground">+15 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.verificationRate}%</div>
              <Progress value={stats.verificationRate} className="h-1 mt-1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingClaims}</div>
              <p className="text-xs text-muted-foreground">Processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Automated</CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.automatedBilling}%</div>
              <p className="text-xs text-muted-foreground">of billing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Payment</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averagePayment} days</div>
              <p className="text-xs text-muted-foreground">processing time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="verification">Insurance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Refresh className="w-4 h-4 mr-2" />
                Sync
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{transaction.patient}</div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.service} • ${transaction.amount} • {transaction.time}
                          </div>
                        </div>
                        <Badge 
                          className={
                            transaction.status === "paid" ? "bg-green-100 text-green-800" :
                            transaction.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            "bg-blue-100 text-blue-800"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Verifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Insurance Verifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insuranceVerifications.map((verification, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{verification.patient}</div>
                          <div className="text-xs text-muted-foreground">
                            {verification.insurance} • {verification.coverage} • {verification.time}
                          </div>
                        </div>
                        <Badge 
                          className={
                            verification.status === "verified" ? "bg-green-100 text-green-800" :
                            verification.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }
                        >
                          {verification.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="text-sm font-medium mb-2">{method.method}</div>
                      <div className="text-2xl font-bold mb-1">{method.percentage}%</div>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={method.percentage} className="flex-1 h-2" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${method.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Management</CardTitle>
                <CardDescription>Generate and track patient invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Invoice management interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Verification</CardTitle>
                <CardDescription>Real-time insurance coverage verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                  <p>Insurance verification interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing Analytics</CardTitle>
                <CardDescription>Revenue tracking and payment analytics</CardDescription>
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

export default BillingIQ;
