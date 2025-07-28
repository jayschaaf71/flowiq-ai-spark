import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Megaphone, Target } from "lucide-react";

// Import components from MarketingIQ, GoToMarketIQ, and ReferralIQ
import MarketingIQ from './MarketingIQ';
import GoToMarketIQ from './GoToMarketIQ';
import ReferralIQ from './ReferralIQ';

const GrowthIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Growth iQ"
          subtitle="Comprehensive marketing, patient acquisition, and practice growth platform"
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="acquisition" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Acquisition
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Referrals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Growth Overview Cards */}
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">New Patients</h3>
                <p className="text-3xl font-bold text-primary">28</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
                <p className="text-3xl font-bold text-green-500">34.2%</p>
                <p className="text-sm text-muted-foreground">+5.1% improvement</p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">Active Campaigns</h3>
                <p className="text-3xl font-bold text-orange-500">4</p>
                <p className="text-sm text-muted-foreground">2 outperforming goals</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="marketing">
            <MarketingIQ />
          </TabsContent>
          
          <TabsContent value="acquisition">
            <GoToMarketIQ />
          </TabsContent>
          
          <TabsContent value="referrals">
            <ReferralIQ />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default GrowthIQ;