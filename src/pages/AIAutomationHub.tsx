import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AISchedulingAssistant } from '@/components/ai/AISchedulingAssistant';
import { AIIntakeProcessor } from '@/components/ai/AIIntakeProcessor';
import { AINotificationCenter } from '@/components/ai/AINotificationCenter';
import { 
  Brain, 
  Calendar, 
  FileText, 
  Bell, 
  Zap,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

export const AIAutomationHub = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          AI Automation Hub
        </h1>
        <p className="text-muted-foreground">
          Intelligent automation for scheduling, intake processing, and patient communications
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              Active Automations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Running workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Efficiency Gain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">Time saved vs manual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Patients Served
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-600" />
              AI Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Across all systems</p>
          </CardContent>
        </Card>
      </div>

      {/* Main AI Components */}
      <Tabs defaultValue="scheduling" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scheduling" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            AI Scheduling
          </TabsTrigger>
          <TabsTrigger value="intake" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Intake Processing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Smart Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduling">
          <AISchedulingAssistant />
        </TabsContent>

        <TabsContent value="intake">
          <AIIntakeProcessor />
        </TabsContent>

        <TabsContent value="notifications">
          <AINotificationCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};