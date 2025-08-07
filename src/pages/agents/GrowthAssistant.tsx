import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { NotificationCenter } from '@/components/ui/NotificationCenter';
import {
  Target,
  BarChart3,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Database,
  Download,
  Upload,
  Search,
  Filter,
  User,
  RefreshCw,
  Play,
  Square,
  Zap,
  Workflow,
  Gauge,
  Activity,
  MessageSquare,
  Mail,
  Smartphone,
  Monitor,
  Users,
  Eye,
  MousePointer,
  Share2,
  FileText
} from 'lucide-react';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

interface EducationContent {
  id: string;
  title: string;
  type: 'video' | 'article' | 'infographic' | 'quiz';
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  engagement: number;
  lastUpdated: string;
}

interface MarketingCampaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'ads';
  status: 'active' | 'paused' | 'completed' | 'draft';
  reach: number;
  engagement: number;
  conversion: number;
  startDate: string;
  endDate: string;
}

export const GrowthAssistant = () => {
  const [selectedTab, setSelectedTab] = useState('analytics');

  // Mock data
  const analyticsMetrics: AnalyticsMetric[] = [
    {
      id: '1',
      name: 'New Patients',
      value: 24,
      change: 12,
      trend: 'up',
      period: 'This Month'
    },
    {
      id: '2',
      name: 'Patient Retention',
      value: 87,
      change: -2,
      trend: 'down',
      period: 'This Month'
    },
    {
      id: '3',
      name: 'Revenue Growth',
      value: 15,
      change: 8,
      trend: 'up',
      period: 'This Month'
    },
    {
      id: '4',
      name: 'Appointment Fill Rate',
      value: 94,
      change: 3,
      trend: 'up',
      period: 'This Month'
    }
  ];

  const educationContent: EducationContent[] = [
    {
      id: '1',
      title: 'Understanding Sleep Apnea',
      type: 'video',
      status: 'published',
      views: 156,
      engagement: 78,
      lastUpdated: '2024-01-15 10:30 AM'
    },
    {
      id: '2',
      title: 'CPAP Therapy Guide',
      type: 'article',
      status: 'published',
      views: 89,
      engagement: 92,
      lastUpdated: '2024-01-14 09:15 AM'
    },
    {
      id: '3',
      title: 'Sleep Hygiene Tips',
      type: 'infographic',
      status: 'draft',
      views: 0,
      engagement: 0,
      lastUpdated: '2024-01-13 08:45 AM'
    },
    {
      id: '4',
      title: 'Sleep Study Preparation',
      type: 'quiz',
      status: 'scheduled',
      views: 0,
      engagement: 0,
      lastUpdated: '2024-01-12 07:30 AM'
    }
  ];

  const marketingCampaigns: MarketingCampaign[] = [
    {
      id: '1',
      name: 'Sleep Awareness Month',
      type: 'email',
      status: 'active',
      reach: 1250,
      engagement: 18.5,
      conversion: 4.2,
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: '2',
      name: 'CPAP Success Stories',
      type: 'social',
      status: 'active',
      reach: 3200,
      engagement: 12.3,
      conversion: 2.8,
      startDate: '2024-01-10',
      endDate: '2024-01-25'
    },
    {
      id: '3',
      name: 'Free Sleep Consultation',
      type: 'ads',
      status: 'paused',
      reach: 850,
      engagement: 8.7,
      conversion: 1.5,
      startDate: '2024-01-05',
      endDate: '2024-01-20'
    },
    {
      id: '4',
      name: 'Patient Referral Program',
      type: 'sms',
      status: 'draft',
      reach: 0,
      engagement: 0,
      conversion: 0,
      startDate: '2024-02-01',
      endDate: '2024-02-28'
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 rotate-180" />;
      case 'stable':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getContentStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500 text-white';
      case 'draft':
        return 'bg-yellow-500 text-white';
      case 'scheduled':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'paused':
        return 'bg-yellow-500 text-white';
      case 'completed':
        return 'bg-blue-500 text-white';
      case 'draft':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'infographic':
        return <BarChart3 className="h-4 w-4" />;
      case 'quiz':
        return <Target className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      case 'social':
        return <Share2 className="h-4 w-4" />;
      case 'ads':
        return <MousePointer className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Growth Assistant</h1>
          <p className="text-gray-600">AI-powered growth analytics, patient education, and marketing automation</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <Badge variant="outline" className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            AI Assistant
          </Badge>
        </div>
      </div>

      {/* Growth Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">New Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">24</div>
            <div className="text-xs text-blue-700 mt-2">+12% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">15%</div>
            <div className="text-xs text-green-700 mt-2">+8% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Patient Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">87%</div>
            <div className="text-xs text-purple-700 mt-2">+5% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">4.2%</div>
            <div className="text-xs text-orange-700 mt-2">+0.8% from last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Growth Analytics
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Patient Education
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Marketing Campaigns
          </TabsTrigger>
        </TabsList>

        {/* Growth Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Analytics Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Key Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getTrendColor(metric.trend)}`}>
                          {getTrendIcon(metric.trend)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{metric.name}</div>
                          <div className="text-sm text-gray-600">{metric.period}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{metric.value}</div>
                          <div className={`text-sm ${getTrendColor(metric.trend)}`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </div>
                        </div>
                        <Badge className={getTrendColor(metric.trend)}>
                          {metric.trend.charAt(0).toUpperCase() + metric.trend.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Patient Acquisition</h4>
                    <p className="text-sm text-green-700">New patient referrals increased by 15% this month</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Revenue Optimization</h4>
                    <p className="text-sm text-blue-700">Average patient value increased by 8% through upselling</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Engagement Boost</h4>
                    <p className="text-sm text-purple-700">Patient education content engagement up 23%</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Conversion Rate</h4>
                    <p className="text-sm text-orange-700">Marketing campaigns showing 4.2% conversion rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Patient Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Education Content */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Patient Education Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {educationContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getContentStatusColor(content.status)}`}>
                          {getContentTypeIcon(content.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{content.title}</div>
                          <div className="text-sm text-gray-600 capitalize">{content.type}</div>
                          <div className="text-xs text-gray-500 mt-1">Last updated: {content.lastUpdated}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{content.views}</div>
                          <div className="text-sm text-gray-600">{content.engagement}% engagement</div>
                        </div>
                        <Badge className={getContentStatusColor(content.status)}>
                          {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Education Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Total Views</div>
                      <div className="text-sm text-green-700">Content engagement</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">1,247</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">Avg Engagement</div>
                      <div className="text-sm text-blue-700">Time spent on content</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">78%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-900">Completion Rate</div>
                      <div className="text-sm text-purple-700">Content completion</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">92%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Marketing Campaigns Tab */}
        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Campaign List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Marketing Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketingCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getCampaignStatusColor(campaign.status)}`}>
                          {getCampaignTypeIcon(campaign.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-600 capitalize">{campaign.type} • {campaign.startDate} to {campaign.endDate}</div>
                          <div className="text-xs text-gray-500 mt-1">Reach: {campaign.reach.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{campaign.engagement}%</div>
                          <div className="text-sm text-gray-600">{campaign.conversion}% conversion</div>
                        </div>
                        <Badge className={getCampaignStatusColor(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Campaign Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Total Reach</div>
                      <div className="text-sm text-green-700">Campaign impressions</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">5.3K</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">Avg Engagement</div>
                      <div className="text-sm text-blue-700">Interaction rate</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">14.8%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-900">Conversion Rate</div>
                      <div className="text-sm text-purple-700">Lead generation</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">3.2%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 