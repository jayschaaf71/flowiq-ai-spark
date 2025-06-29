
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueAnalyticsDashboard } from '@/components/financial/RevenueAnalyticsDashboard';
import { ClaimsManagementHub } from '@/components/financial/ClaimsManagementHub';
import { PaymentProcessingCenter } from '@/components/financial/PaymentProcessingCenter';
import { FinancialReporting } from '@/components/financial/FinancialReporting';
import { BillingWorkflow } from '@/components/financial/BillingWorkflow';

export const FinancialManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="claims">Claims Management</TabsTrigger>
          <TabsTrigger value="payments">Payment Processing</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          <TabsTrigger value="billing">Billing Workflow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-6">
          <RevenueAnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="claims" className="space-y-6">
          <ClaimsManagementHub />
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-6">
          <PaymentProcessingCenter />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <FinancialReporting />
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-6">
          <BillingWorkflow />
        </TabsContent>
      </Tabs>
    </div>
  );
};
