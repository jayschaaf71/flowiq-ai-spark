import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PracticeAnalytics } from '@/components/analytics/PracticeAnalytics';
import { ReportingCenter } from '@/components/analytics/ReportingCenter';

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reporting</h1>
        <p className="text-muted-foreground">
          Comprehensive insights and reporting for data-driven practice management
        </p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">Practice Analytics</TabsTrigger>
          <TabsTrigger value="reporting">Reporting Center</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <PracticeAnalytics />
        </TabsContent>

        <TabsContent value="reporting">
          <ReportingCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};