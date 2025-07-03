import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Megaphone, 
  Star, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  MessageCircle,
  Share2
} from 'lucide-react';

const MarketingIQ = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing IQ</h1>
          <p className="text-muted-foreground">Campaigns, ads, and review management</p>
        </div>
        <Badge variant="default">AI Powered</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-success">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-success">+0.2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
            <p className="text-xs text-success">+5% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-success">+12 this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Management
            </CardTitle>
            <CardDescription>Create and manage marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">New Patient Special</p>
                  <p className="text-sm text-muted-foreground">Google Ads • Active</p>
                </div>
                <Badge variant="success">Live</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Dental Health Awareness</p>
                  <p className="text-sm text-muted-foreground">Facebook • Scheduled</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Summer Smile Package</p>
                  <p className="text-sm text-muted-foreground">Instagram • Draft</p>
                </div>
                <Badge variant="outline">Draft</Badge>
              </div>
            </div>
            <Button className="w-full">Create New Campaign</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Review Management
            </CardTitle>
            <CardDescription>Monitor and respond to patient reviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm">"Excellent service and friendly staff!"</p>
                  <p className="text-xs text-muted-foreground mt-1">Sarah M. • Google</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex">
                  {[1,2,3,4].map(star => (
                    <Star key={star} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                  <Star className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">"Good service, but long wait time."</p>
                  <p className="text-xs text-muted-foreground mt-1">John D. • Yelp</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">View All Reviews</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Analytics
            </CardTitle>
            <CardDescription>Track campaign performance and ROI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Click-through Rate</span>
                <span className="font-medium">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cost per Lead</span>
                <span className="font-medium">$18.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Return on Ad Spend</span>
                <span className="font-medium">4.8x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Patient Lifetime Value</span>
                <span className="font-medium">$1,200</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Media
            </CardTitle>
            <CardDescription>Manage social media presence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <p className="font-medium">Facebook</p>
                <p className="text-2xl font-bold">1.2k</p>
                <p className="text-xs text-muted-foreground">followers</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="font-medium">Instagram</p>
                <p className="text-2xl font-bold">890</p>
                <p className="text-xs text-muted-foreground">followers</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">Schedule Posts</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingIQ;