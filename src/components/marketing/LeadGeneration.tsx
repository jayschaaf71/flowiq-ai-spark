import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLeadSourceAnalytics } from '@/hooks/useMarketingAnalytics';
import { TrendingUp, Users, DollarSign, Plus } from 'lucide-react';

export const LeadGeneration = () => {
  const { data: leadSources, isLoading } = useLeadSourceAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Generation</h2>
          <p className="text-muted-foreground">Track and optimize your lead sources</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead Source
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{leadSources?.reduce((sum, s) => sum + s.lead_count, 0) || 0}</p>
                <p className="text-sm text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${leadSources?.reduce((sum, s) => sum + s.revenue, 0).toLocaleString() || 0}</p>
                <p className="text-sm text-muted-foreground">Revenue Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{leadSources?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Active Sources</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Sources List */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Sources Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leadSources?.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lead sources found</h3>
                <p className="text-gray-500 mb-4">Start tracking your lead sources to optimize your marketing efforts</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Lead Source
                </Button>
              </div>
            ) : (
              leadSources?.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{source.source_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{source.source_type}</Badge>
                        <Badge variant="secondary" className="text-xs">{source.conversion_rate}% conversion</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{source.lead_count}</div>
                    <div className="text-sm text-muted-foreground">leads</div>
                    <div className="text-sm font-medium text-green-600">${source.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};