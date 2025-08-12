import React, { useState } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, CreditCard, FileText } from "lucide-react";

// Import components from PaymentsIQ and BillingIQ
import { PaymentsIQ } from './PaymentsIQ';
import BillingIQ from './BillingIQ';

const RevenueIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue iQ"
        subtitle="Comprehensive payment processing, billing, and revenue management"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue Overview Cards */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
              <p className="text-3xl font-bold text-primary">$47,230</p>
              <p className="text-sm text-muted-foreground">+12% from last month</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Outstanding</h3>
              <p className="text-3xl font-bold text-orange-500">$8,450</p>
              <p className="text-sm text-muted-foreground">23 pending invoices</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Collection Rate</h3>
              <p className="text-3xl font-bold text-green-500">94.2%</p>
              <p className="text-sm text-muted-foreground">+2.1% improvement</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsIQ />
        </TabsContent>

        <TabsContent value="billing">
          <BillingIQ />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
            <p className="text-muted-foreground">Detailed revenue analytics and reporting coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueIQ;