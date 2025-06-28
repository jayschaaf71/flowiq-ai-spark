
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAutomationDashboard } from '@/components/ai/AIAutomationDashboard';
import { SmartSchedulingEngine } from '@/components/ai/SmartSchedulingEngine';
import { PredictiveAnalytics } from '@/components/ai/PredictiveAnalytics';
import { AutomatedWorkflows } from '@/components/ai/AutomatedWorkflows';

export const AIAutomationPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">AI Dashboard</TabsTrigger>
          <TabsTrigger value="scheduling">Smart Scheduling</TabsTrigger>
          <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="workflows">Automated Workflows</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <AIAutomationDashboard />
        </TabsContent>
        
        <TabsContent value="scheduling" className="space-y-6">
          <SmartSchedulingEngine />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <PredictiveAnalytics />
        </TabsContent>
        
        <TabsContent value="workflows" className="space-y-6">
          <AutomatedWorkflows />
        </TabsContent>
      </Tabs>
    </div>
  );
};
