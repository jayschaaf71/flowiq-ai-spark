
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, CreditCard, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BillingDashboard } from "@/components/billing/BillingDashboard";

export default function BillingIQ() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing iQ"
        subtitle="AI-powered billing and revenue cycle management"
        badge="AI"
      />

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <BillingDashboard />
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Claims Management</CardTitle>
              <CardDescription>
                Track and manage insurance claims processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">45</div>
                    <p className="text-sm text-muted-foreground">Pending Claims</p>
                    <p className="text-xs text-green-600">↓ 5 from yesterday</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">$127k</div>
                    <p className="text-sm text-muted-foreground">Claims Submitted</p>
                    <p className="text-xs text-green-600">This month</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">89%</div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-xs text-green-600">Above target</p>
                  </div>
                </div>
                
                <div className="border rounded-lg">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Recent Claims Activity</h3>
                  </div>
                  <div className="divide-y">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Claim #CLM-2024-001</p>
                        <p className="text-sm text-muted-foreground">John Smith - Office Visit</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Approved</Badge>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Claim #CLM-2024-002</p>
                        <p className="text-sm text-muted-foreground">Sarah Johnson - Consultation</p>
                      </div>
                      <Badge variant="secondary">Processing</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing</CardTitle>
              <CardDescription>
                Automated payment posting and reconciliation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-green-600 mb-3">Payment Methods</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Credit Cards</span>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>ACH/Bank Transfer</span>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Payment Plans</span>
                        <Badge variant="secondary">Available</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-blue-600 mb-3">Recent Payments</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">John Smith</span>
                        <span className="text-sm font-semibold text-green-600">$150.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Sarah Johnson</span>
                        <span className="text-sm font-semibold text-green-600">$75.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Mike Chen</span>
                        <span className="text-sm font-semibold text-blue-600">$200.00</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button>Process New Payment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Comprehensive billing and revenue analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-xl font-bold text-blue-600">$45,200</div>
                    <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-xl font-bold text-green-600">92%</div>
                    <p className="text-sm text-muted-foreground">Collection Rate</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-xl font-bold text-purple-600">28</div>
                    <p className="text-sm text-muted-foreground">Days in A/R</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-xl font-bold text-orange-600">5.2%</div>
                    <p className="text-sm text-muted-foreground">Denial Rate</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Revenue Trends</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Insurance Payments</span>
                        <span className="text-sm font-semibold">$32,400 (72%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '72%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Patient Payments</span>
                        <span className="text-sm font-semibold">$12,800 (28%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '28%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
