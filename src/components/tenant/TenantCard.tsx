
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Crown, Shield, Settings, Palette } from 'lucide-react';
import type { Tenant } from '@/hooks/useTenantManagement';

interface TenantCardProps {
  tenant: Tenant;
  onSettingsClick: (tenant: Tenant) => void;
}

export const TenantCard: React.FC<TenantCardProps> = ({ tenant, onSettingsClick }) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'enterprise': return Crown;
      case 'professional': return Shield;
      case 'basic': return Building2;
      default: return Building2;
    }
  };

  const TierIcon = getTierIcon(tenant.subscription_tier);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{tenant.brand_name}</CardTitle>
              <CardDescription>{tenant.specialty}</CardDescription>
            </div>
          </div>
          <Badge className={getTierColor(tenant.subscription_tier)}>
            <TierIcon className="w-3 h-3 mr-1" />
            {tenant.subscription_tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Domain:</span>
            <span>{tenant.domain || tenant.subdomain || 'Not set'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Max Forms:</span>
            <span>{tenant.max_forms}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Max Users:</span>
            <span>{tenant.max_users}</span>
          </div>
          <div className="flex space-x-2 pt-3">
            {tenant.custom_branding_enabled && (
              <Badge variant="outline">
                <Palette className="w-3 h-3 mr-1" />
                Custom Branding
              </Badge>
            )}
            {tenant.api_access_enabled && (
              <Badge variant="outline">
                <Settings className="w-3 h-3 mr-1" />
                API Access
              </Badge>
            )}
          </div>
          <div className="flex space-x-2 pt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSettingsClick(tenant)}
            >
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
