import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueDashboard } from '@/components/revenue/RevenueDashboard';
import { RevenueCycleManager } from '@/components/revenue/RevenueCycleManager';
import { InsuranceManager } from '@/components/revenue/InsuranceManager';
import { RevenueAnalytics } from '@/components/revenue/RevenueAnalytics';
import { AutomatedInsuranceAgent } from '@/components/revenue/AutomatedInsuranceAgent';
import { NotificationCenter } from '@/components/ui/NotificationCenter';

export const RevenueAssistant = () => {
  const [activeTab, setActiveTab] = useState('automated-agent');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Assistant</h1>
          <p className="text-gray-600">Streamlined revenue management and financial optimization</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="automated-agent" className="flex items-center gap-2">
            🤖 Automated Agent
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            📊 Dashboard
          </TabsTrigger>
          <TabsTrigger value="revenue-cycle" className="flex items-center gap-2">
            💰 Revenue Cycle
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-2">
            🛡️ Insurance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            📈 Analytics
          </TabsTrigger>
        </TabsList>

        {/* Automated Insurance Agent Tab - NEW PRIMARY TAB */}
        <TabsContent value="automated-agent" className="space-y-6">
          <AutomatedInsuranceAgent />
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <RevenueDashboard />
        </TabsContent>

        {/* Revenue Cycle Tab */}
        <TabsContent value="revenue-cycle" className="space-y-6">
          <RevenueCycleManager />
        </TabsContent>

        {/* Insurance Tab */}
        <TabsContent value="insurance" className="space-y-6">
          <InsuranceManager />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <RevenueAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 