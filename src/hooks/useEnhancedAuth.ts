
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserRole {
  tenant_id: string;
  role: 'platform_admin' | 'tenant_admin' | 'practice_manager' | 'staff' | 'patient';
  permissions: Record<string, any>;
  tenant: {
    id: string;
    name: string;
    brand_name: string;
    specialty: string;
  };
}

export const useEnhancedAuth = () => {
  const { user, profile } = useAuth();
  
  // Fetch user's tenant roles and permissions
  const { data: userRoles, isLoading: rolesLoading, error: rolesError } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('Fetching user roles for:', user.id);
      
      const { data, error } = await supabase
        .from('tenant_users')
        .select(`
          tenant_id,
          role,
          permissions,
          tenants!tenant_users_tenant_id_fkey(
            id,
            name,
            brand_name,
            specialty
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching user roles:', error);
        // Don't throw error - return empty array to prevent blocking
        return [];
      }
      
      console.log('Raw tenant_users data:', data);
      
      // Transform the data to match our UserRole interface
      const roles = (data || []).map(item => ({
        tenant_id: item.tenant_id,
        role: item.role,
        permissions: item.permissions || {},
        tenant: {
          id: item.tenants?.id || '',
          name: item.tenants?.name || '',
          brand_name: item.tenants?.brand_name || '',
          specialty: item.tenants?.specialty || ''
        }
      })) as UserRole[];
      
      console.log('Transformed user roles:', roles);
      return roles;
    },
    enabled: !!user?.id,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get current tenant context
  const getCurrentTenantRole = (tenantId?: string) => {
    if (!userRoles || !tenantId) return null;
    return userRoles.find(role => role.tenant_id === tenantId);
  };

  // Check if user has specific permission
  const hasPermission = (permission: string, tenantId?: string) => {
    if (!userRoles) return false;
    
    // Platform admins have all permissions
    if (userRoles.some(role => role.role === 'platform_admin')) return true;
    
    const role = getCurrentTenantRole(tenantId);
    if (!role) return false;
    
    // Check specific permissions
    return role.permissions[permission] === true;
  };

  // Check if user has minimum role level
  const hasMinimumRole = (minimumRole: string, tenantId?: string) => {
    if (!userRoles) return false;
    
    // Platform admins always have access
    if (userRoles.some(role => role.role === 'platform_admin')) return true;
    
    const roleHierarchy = {
      'patient': 0,
      'staff': 1,
      'practice_manager': 2,
      'tenant_admin': 3,
      'platform_admin': 4
    };
    
    const requiredLevel = roleHierarchy[minimumRole as keyof typeof roleHierarchy] || 0;
    
    // If no specific tenant, check if user has the role in any tenant
    if (!tenantId) {
      return userRoles.some(role => {
        const userLevel = roleHierarchy[role.role as keyof typeof roleHierarchy] || 0;
        return userLevel >= requiredLevel;
      });
    }
    
    // Check specific tenant
    const role = getCurrentTenantRole(tenantId);
    if (!role) return false;
    
    const userLevel = roleHierarchy[role.role as keyof typeof roleHierarchy] || 0;
    return userLevel >= requiredLevel;
  };

  // Get primary tenant
  const getPrimaryTenant = () => {
    if (!userRoles || userRoles.length === 0) return null;
    
    // Return tenant that matches profile's primary_tenant_id if available
    const profileTenantId = (profile as any)?.primary_tenant_id;
    if (profileTenantId) {
      const primaryRole = userRoles.find(role => role.tenant_id === profileTenantId);
      if (primaryRole) return primaryRole;
    }
    
    // Fallback to first tenant with highest role
    return userRoles.sort((a, b) => {
      const roleOrder = { 'platform_admin': 4, 'tenant_admin': 3, 'practice_manager': 2, 'staff': 1, 'patient': 0 };
      return (roleOrder[b.role] || 0) - (roleOrder[a.role] || 0);
    })[0];
  };

  const canAccessTenant = (tenantId?: string) => {
    if (!tenantId || !userRoles) return false;
    return getCurrentTenantRole(tenantId) !== null;
  };

  const isPlatformAdmin = userRoles?.some(role => role.role === 'platform_admin') || false;

  // Log current state for debugging but don't log errors to avoid noise
  useEffect(() => {
    if (user && !rolesLoading && !rolesError) {
      console.log('Enhanced Auth State:', {
        userId: user.id,
        userRoles: userRoles?.length || 0,
        primaryTenant: getPrimaryTenant()?.tenant?.name,
        isPlatformAdmin
      });
    }
  }, [user, userRoles, rolesLoading, rolesError]);

  return {
    user,
    profile,
    userRoles: userRoles || [],
    rolesLoading,
    rolesError,
    primaryTenant: getPrimaryTenant(),
    getCurrentTenantRole,
    hasPermission,
    hasMinimumRole,
    isPlatformAdmin,
    isTenantAdmin: (tenantId?: string) => {
      const role = getCurrentTenantRole(tenantId);
      return role?.role === 'tenant_admin' || role?.role === 'platform_admin';
    },
    canManageTenant: (tenantId?: string) => hasMinimumRole('practice_manager', tenantId),
    canAccessTenant,
  };
};
