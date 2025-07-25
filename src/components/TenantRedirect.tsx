import React from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { parseTenantFromUrl, getSpecialtyRoute } from '@/utils/tenantRouting';

export const TenantRedirect: React.FC = () => {
  const { data: userProfile, isLoading } = useUserProfile();
  const tenantRoute = parseTenantFromUrl();
  const currentPath = window.location.pathname;

  React.useEffect(() => {
    // Only redirect if:
    // 1. User profile is loaded
    // 2. No tenant route detected from URL
    // 3. User is on root path
    // 4. User has a current tenant
    if (!isLoading && !tenantRoute && currentPath === '/' && userProfile?.current_tenant_id) {
      console.log('🔄 [DIAGNOSTIC] TenantRedirect - Redirecting user to their tenant dashboard');
      
      // Map tenant ID to specialty route
      const tenantSpecialtyMap: Record<string, string> = {
        'd52278c3-bf0d-4731-bfa9-a40f032fa305': 'dental-sleep-medicine', // Midwest Dental Sleep
        '024e36c1-a1bc-44d0-8805-3162ba59a0c2': 'chiropractic-care'       // West County Spine
      };
      
      const specialty = tenantSpecialtyMap[userProfile.current_tenant_id];
      if (specialty) {
        const targetRoute = getSpecialtyRoute(specialty, 'dashboard');
        console.log('🚀 [DIAGNOSTIC] Redirecting to:', targetRoute);
        window.location.href = targetRoute;
      }
    }
  }, [isLoading, tenantRoute, currentPath, userProfile]);

  return null; // This component doesn't render anything
};