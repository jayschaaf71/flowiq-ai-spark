import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CampaignManager } from './CampaignManager';
import { ReviewManagement } from './ReviewManagement';
import { MarketingAnalytics } from './MarketingAnalytics';
import { SocialMediaManager } from './SocialMediaManager';
import { LeadGeneration } from './LeadGeneration';
import { MarketingAutomation } from './MarketingAutomation';
import { useMarketingAnalytics } from '@/hooks/useMarketingAnalytics';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Target,
  DollarSign,
  Activity,
  Megaphone,
  Bot
} from 'lucide-react';

export const MarketingDashboard = () => {
  const { data: analytics, isLoading } = useMarketingAnalytics();
  const [activeTab, setActiveTab] = useState('campaigns');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const metrics = analytics?.metrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing iQ</h1>
          <p className="text-muted-foreground">AI-powered marketing campaigns, reviews, and analytics</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-purple-500">
            <Bot className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <Badge variant="secondary">
            <Activity className="w-3 h-3 mr-1" />
            Real-time Analytics
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setActiveTab('campaigns')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeCampaigns || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {metrics?.totalCampaigns || 0} total campaigns
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setActiveTab('leads')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalLeads || 0}</div>
            <p className="text-xs text-success">
              ${metrics?.avgCostPerLead?.toFixed(2) || 0} avg cost per lead
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setActiveTab('analytics')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.conversionRate?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">
              from marketing campaigns
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setActiveTab('analytics')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.roi?.toFixed(1) || 0}%</div>
            <p className="text-xs text-success">
              ${metrics?.totalRevenue?.toLocaleString() || 0} revenue generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="leads">Lead Gen</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <CampaignManager />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <ReviewManagement />
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <SocialMediaManager />
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <LeadGeneration />
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <MarketingAutomation />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <MarketingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};