
import React from 'react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface TenantProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  tenantId?: string;
  fallback?: React.ReactNode;
}

export const TenantProtectedRoute: React.FC<TenantProtectedRouteProps> = ({
  children,
  requiredRole = 'staff',
  tenantId,
  fallback
}) => {
  const { rolesLoading, hasMinimumRole, canAccessTenant, userRoles, isPlatformAdmin } = useEnhancedAuth();

  if (rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 text-blue-600 mx-auto animate-pulse" />
          <div className="text-lg font-medium">Verifying tenant access...</div>
          <div className="text-sm text-gray-600">Please wait while we check your permissions</div>
        </div>
      </div>
    );
  }

  // Platform admins can access everything
  if (isPlatformAdmin) {
    return <>{children}</>;
  }

  // If no tenant is specified and user has any tenant access with the required role, allow access
  if (!tenantId && userRoles.length > 0) {
    const hasRequiredRoleInAnyTenant = userRoles.some(role => {
      const roleHierarchy = {
        'patient': 0,
        'staff': 1,
        'practice_manager': 2,
        'tenant_admin': 3,
        'platform_admin': 4
      };
      
      const userLevel = roleHierarchy[role.role as keyof typeof roleHierarchy] || 0;
      const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
      
      return userLevel >= requiredLevel;
    });

    if (!hasRequiredRoleInAnyTenant) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="font-medium mb-2">Insufficient Permissions</div>
                <p>You need {requiredRole} level access to view this content.</p>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return <>{children}</>;
  }

  // Check tenant access if specific tenant is required
  if (tenantId && !canAccessTenant(tenantId)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-medium mb-2">Tenant Access Denied</div>
              <p>You do not have access to this tenant. Please contact your administrator.</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Check role requirement for specific tenant
  if (tenantId && !hasMinimumRole(requiredRole, tenantId)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="font-medium mb-2">Insufficient Permissions</div>
              <p>You need {requiredRole} level access to view this content.</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
