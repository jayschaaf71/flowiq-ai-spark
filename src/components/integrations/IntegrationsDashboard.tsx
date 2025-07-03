import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Code, 
  Webhook, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

import { ZapierIntegration } from './ZapierIntegration';
import { IframeWidget } from './IframeWidget';
import { WebhookManager } from './WebhookManager';
import { EmbeddablePatientPortal } from './EmbeddablePatientPortal';

export const IntegrationsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const integrationStats = {
    activeWebhooks: 3,
    zapierConnections: 5,
    widgetEmbeds: 12,
    eventsToday: 47
  };

  const recentActivity = [
    {
      type: 'webhook',
      event: 'appointment.created',
      endpoint: 'EHR System',
      status: 'success',
      timestamp: '2 minutes ago'
    },
    {
      type: 'zapier',
      event: 'followup.initiated',
      action: 'Send Mailchimp Email',
      status: 'success',
      timestamp: '5 minutes ago'
    },
    {
      type: 'widget',
      event: 'appointment.booked',
      source: 'Website Footer',
      status: 'success',
      timestamp: '8 minutes ago'
    },
    {
      type: 'webhook',
      event: 'appointment.no_show',
      endpoint: 'Slack Notifications',
      status: 'error',
      timestamp: '12 minutes ago'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'webhook':
        return <Webhook className="h-4 w-4 text-purple-600" />;
      case 'zapier':
        return <Zap className="h-4 w-4 text-orange-600" />;
      case 'widget':
        return <Code className="h-4 w-4 text-blue-600" />;
      default:
        return <ExternalLink className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">External Integrations</h1>
        <p className="text-gray-600">
          Connect Appointment IQ with external systems and embed booking widgets
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="zapier">Zapier</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="patient-portal">Patient Portal</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Webhooks</p>
                    <p className="text-2xl font-bold">{integrationStats.activeWebhooks}</p>
                  </div>
                  <Webhook className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Zapier Connections</p>
                    <p className="text-2xl font-bold">{integrationStats.zapierConnections}</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Widget Embeds</p>
                    <p className="text-2xl font-bold">{integrationStats.widgetEmbeds}</p>
                  </div>
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Events Today</p>
                    <p className="text-2xl font-bold">{integrationStats.eventsToday}</p>
                  </div>
                  <ExternalLink className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Zapier Integration</CardTitle>
                    <CardDescription>No-code automation workflows</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Connect with 6,000+ apps including Google Calendar, Slack, Mailchimp, and more.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Zaps</span>
                    <Badge variant="secondary">{integrationStats.zapierConnections}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available Triggers</span>
                    <Badge variant="outline">7</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available Actions</span>
                    <Badge variant="outline">3</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Webhook className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Webhook Endpoints</CardTitle>
                    <CardDescription>Real-time system notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Send real-time appointment events to EHR systems, CRMs, and other platforms.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Endpoints</span>
                    <Badge variant="secondary">{integrationStats.activeWebhooks}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Event Types</span>
                    <Badge variant="outline">7</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <Badge variant="outline">98.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Code className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Embeddable Widgets</CardTitle>
                    <CardDescription>Website booking integration</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Add booking widgets to your website, patient portals, and partner sites.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Widgets</span>
                    <Badge variant="secondary">{integrationStats.widgetEmbeds}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customizable</span>
                    <Badge variant="outline">Yes</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Responsive</span>
                    <Badge variant="outline">Yes</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Integration Activity</CardTitle>
              <CardDescription>
                Latest events from your external integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getEventTypeIcon(activity.type)}
                      <div>
                        <div className="font-medium">
                          {activity.type === 'webhook' && activity.endpoint}
                          {activity.type === 'zapier' && activity.action}
                          {activity.type === 'widget' && activity.source}
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.event}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(activity.status)}
                      <span className="text-sm text-gray-500">{activity.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zapier">
          <ZapierIntegration />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookManager />
        </TabsContent>

        <TabsContent value="patient-portal">
          <EmbeddablePatientPortal />
        </TabsContent>

        <TabsContent value="widgets">
          <IframeWidget />
        </TabsContent>
      </Tabs>
    </div>
  );
};