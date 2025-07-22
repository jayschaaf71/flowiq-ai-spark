import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsuranceVerification } from '@/components/billing/InsuranceVerification';
import { ClaimsManagement } from '@/components/billing/ClaimsManagement';
import { RevenueAnalytics } from '@/components/billing/RevenueAnalytics';

export const BillingDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Revenue Management</h1>
        <p className="text-muted-foreground">
          Comprehensive insurance, claims, and revenue cycle management
        </p>
      </div>

      <Tabs defaultValue="insurance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insurance">Insurance Verification</TabsTrigger>
          <TabsTrigger value="claims">Claims Management</TabsTrigger>
          <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="insurance">
          <InsuranceVerification />
        </TabsContent>

        <TabsContent value="claims">
          <ClaimsManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <RevenueAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};