import React from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { detectSpecialty, getBrandName } from '@/utils/unifiedSpecialtyDetection';
import { getSpecialtyRoute } from '@/utils/tenantRouting';

export const TenantRedirect: React.FC = () => {
  const { data: userProfile, isLoading } = useUserProfile();
  const currentPath = window.location.pathname;

  React.useEffect(() => {
    // Phase 5: Improved redirect logic with proper authentication handling
    console.log('🔄 TenantRedirect - isLoading:', isLoading, 'currentPath:', currentPath, 'userProfile:', userProfile);
    
    // Wait for user profile to load
    if (isLoading) {
      console.log('⏳ TenantRedirect - Still loading user profile');
      return;
    }
    
    // Only redirect from root path to avoid infinite loops
    if (currentPath !== '/') {
      console.log('📍 TenantRedirect - Not on root path, skipping redirect');
      return;
    }
    
    // If user has a tenant, detect appropriate specialty and redirect
    if (userProfile?.current_tenant_id) {
      console.log('🔄 TenantRedirect - User has tenant, detecting specialty and redirecting');
      
      const detectionResult = detectSpecialty(userProfile);
      console.log('🎯 TenantRedirect - Detection result:', detectionResult);
      
      // Build target route based on specialty
      let targetRoute: string;
      
      if (detectionResult.specialty === 'dental-sleep') {
        targetRoute = '/dental-sleep-medicine/dashboard';
      } else {
        targetRoute = getSpecialtyRoute(detectionResult.specialty === 'chiropractic' ? 'chiropractic-care' : detectionResult.specialty, 'dashboard');
      }
      
      console.log('🚀 TenantRedirect - Redirecting to:', targetRoute);
      
      // Use replace to avoid back button issues
      window.location.replace(targetRoute);
    } else {
      console.log('👤 TenantRedirect - No tenant found for user, staying on landing page');
    }
  }, [isLoading, currentPath, userProfile]);

  // Show loading state while determining redirect
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return null; // This component doesn't render anything when not loading
};