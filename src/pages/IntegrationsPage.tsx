
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IntegrationDashboard } from '@/components/integrations/IntegrationDashboard';
import { WebhookManager } from '@/components/integrations/WebhookManager';
import { APIMonitoring } from '@/components/integrations/APIMonitoring';
import { CalendarIntegration } from '@/components/ehr/CalendarIntegration';

export const IntegrationsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar Sync</TabsTrigger>
          <TabsTrigger value="monitoring">API Monitoring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <IntegrationDashboard />
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-6">
          <WebhookManager />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-6">
          <CalendarIntegration />
        </TabsContent>
        
        <TabsContent value="monitoring" className="space-y-6">
          <APIMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
};
