
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UserRole {
  role: string;
  tenant_id: string;
}

export const useEnhancedAuth = () => {
  const { user, profile } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setUserRoles([]);
      return;
    }

    const fetchUserRoles = async () => {
      setRolesLoading(true);
      setRolesError(null);

      try {
        // For now, create mock roles based on profile
        const mockRoles: UserRole[] = [];
        
        if (profile?.role) {
          mockRoles.push({
            role: profile.role,
            tenant_id: profile.tenant_id || 'default'
          });
        }

        setUserRoles(mockRoles);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setRolesError(error as Error);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchUserRoles();
  }, [user?.id, profile]);

  const hasMinimumRole = (requiredRole: string, tenantId?: string) => {
    const roleHierarchy = {
      'patient': 0,
      'staff': 1,
      'practice_manager': 2,
      'tenant_admin': 3,
      'platform_admin': 4
    };

    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userRoles.some(role => {
      if (tenantId && role.tenant_id !== tenantId) return false;
      
      const userLevel = roleHierarchy[role.role as keyof typeof roleHierarchy] || 0;
      return userLevel >= requiredLevel;
    });
  };

  const canAccessTenant = (tenantId: string) => {
    return userRoles.some(role => role.tenant_id === tenantId) || isPlatformAdmin;
  };

  const isPlatformAdmin = userRoles.some(role => role.role === 'platform_admin');

  return {
    userRoles,
    rolesLoading,
    rolesError,
    hasMinimumRole,
    canAccessTenant,
    isPlatformAdmin
  };
};
