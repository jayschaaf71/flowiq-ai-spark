
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Variable, TrendingUp } from 'lucide-react';

interface TemplateStats {
  totalTemplates: number;
  emailTemplates: number;
  smsTemplates: number;
  customVariables: number;
  totalUsage: number;
  mostUsedTemplate: string;
}

interface TemplateStatsOverviewProps {
  stats: TemplateStats;
}

export const TemplateStatsOverview: React.FC<TemplateStatsOverviewProps> = ({
  stats
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTemplates}</div>
          <p className="text-xs text-muted-foreground">
            {stats.emailTemplates} email, {stats.smsTemplates} SMS
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Custom Variables</CardTitle>
          <Variable className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.customVariables}</div>
          <p className="text-xs text-muted-foreground">
            Available for use
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsage.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Messages sent this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold truncate">{stats.mostUsedTemplate}</div>
          <p className="text-xs text-muted-foreground">
            Top performing template
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
