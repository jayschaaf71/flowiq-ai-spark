
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Crown, Globe } from 'lucide-react';
import type { Tenant } from '@/hooks/useTenantManagement';

interface TenantStatsCardsProps {
  tenants: Tenant[] | undefined;
}

export const TenantStatsCards: React.FC<TenantStatsCardsProps> = ({ tenants }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold">{tenants?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold">
                {tenants?.reduce((sum, t) => sum + (t.max_users || 0), 0) || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Enterprise</p>
              <p className="text-2xl font-bold">
                {tenants?.filter(t => t.subscription_tier === 'enterprise').length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-cyan-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">White Label</p>
              <p className="text-2xl font-bold">
                {tenants?.filter(t => t.white_label_enabled).length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
