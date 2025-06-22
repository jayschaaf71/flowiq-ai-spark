
import React from 'react';
import { Building2 } from 'lucide-react';

export const TenantLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Building2 className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
        <h3 className="text-lg font-semibold mb-2">Loading Tenant Dashboard</h3>
        <p className="text-gray-600">Please wait while we load your tenant information...</p>
      </div>
    </div>
  );
};
