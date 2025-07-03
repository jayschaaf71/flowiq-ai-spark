import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLeadSourceAnalytics } from '@/hooks/useMarketingAnalytics';

export const LeadGeneration = () => {
  const { data: leadSources } = useLeadSourceAnalytics();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lead Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leadSources?.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{source.source_name}</h3>
                  <p className="text-sm text-muted-foreground">{source.source_type}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">{source.lead_count} leads</div>
                  <div className="text-sm text-muted-foreground">${source.revenue.toLocaleString()} revenue</div>
                </div>
              </div>
            ))}
            <Button className="w-full">Add Lead Source</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};