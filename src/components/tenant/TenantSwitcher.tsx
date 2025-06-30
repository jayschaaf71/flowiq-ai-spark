
import React from 'react';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { Badge } from '@/components/ui/badge';
import { Building2, Loader2 } from 'lucide-react';

export const TenantSwitcher: React.FC = () => {
  const { currentTenant, loading } = useCurrentTenant();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!currentTenant) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-gray-600" />
      <span className="text-sm font-medium">{currentTenant.brand_name}</span>
      <Badge variant="outline" className="text-xs">
        {currentTenant.specialty.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    </div>
  );
};
