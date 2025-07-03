import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMarketingAnalytics } from '@/hooks/useMarketingAnalytics';

export const MarketingAnalytics = () => {
  const { data: analytics } = useMarketingAnalytics();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketing Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics?.metrics?.roi?.toFixed(1) || 0}%</div>
              <div className="text-sm text-muted-foreground">ROI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics?.metrics?.conversionRate?.toFixed(1) || 0}%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${analytics?.metrics?.avgCostPerLead?.toFixed(2) || 0}</div>
              <div className="text-sm text-muted-foreground">Cost Per Lead</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics?.metrics?.totalLeads || 0}</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};