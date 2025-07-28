import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileCheck, CreditCard, BarChart3 } from "lucide-react";

// Import components from ClaimsIQ and AuthIQ
import ClaimsIQ from './ClaimsIQ';
import AuthIQ from './AuthIQ';

const InsuranceIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Insurance iQ"
          subtitle="Complete insurance verification, claims processing, and authorization management"
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="claims" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Claims
            </TabsTrigger>
            <TabsTrigger value="authorization" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Authorization
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Verification
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Insurance Overview Cards */}
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">Claims Processed</h3>
                <p className="text-3xl font-bold text-primary">247</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">Approval Rate</h3>
                <p className="text-3xl font-bold text-green-500">91.4%</p>
                <p className="text-sm text-muted-foreground">+3.2% improvement</p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">Pending Auth</h3>
                <p className="text-3xl font-bold text-orange-500">12</p>
                <p className="text-sm text-muted-foreground">Requiring attention</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="claims">
            <ClaimsIQ />
          </TabsContent>
          
          <TabsContent value="authorization">
            <AuthIQ />
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Insurance Verification</h3>
              <p className="text-muted-foreground">Real-time insurance eligibility verification tools coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default InsuranceIQ;