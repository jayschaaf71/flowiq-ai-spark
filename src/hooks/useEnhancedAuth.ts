
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
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
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
      
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!user?.id,
  });

  // Get current tenant context
  const getCurrentTenantRole = (tenantId?: string) => {
    if (!userRoles || !tenantId) return null;
    return userRoles.find(role => role.tenant_id === tenantId);
  };

  // Check if user has specific permission
  const hasPermission = (permission: string, tenantId?: string) => {
    const role = getCurrentTenantRole(tenantId);
    if (!role) return false;
    
    // Platform admins have all permissions
    if (role.role === 'platform_admin') return true;
    
    // Check specific permissions
    return role.permissions[permission] === true;
  };

  // Check if user has minimum role level
  const hasMinimumRole = (minimumRole: string, tenantId?: string) => {
    const role = getCurrentTenantRole(tenantId);
    if (!role) return false;
    
    const roleHierarchy = {
      'patient': 0,
      'staff': 1,
      'practice_manager': 2,
      'tenant_admin': 3,
      'platform_admin': 4
    };
    
    const userLevel = roleHierarchy[role.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[minimumRole as keyof typeof roleHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  };

  // Get primary tenant
  const getPrimaryTenant = () => {
    if (!userRoles || userRoles.length === 0) return null;
    
    // Return tenant that matches profile's primary_tenant_id
    if (profile?.primary_tenant_id) {
      const primaryRole = userRoles.find(role => role.tenant_id === profile.primary_tenant_id);
      if (primaryRole) return primaryRole;
    }
    
    // Fallback to first tenant with highest role
    return userRoles.sort((a, b) => {
      const roleOrder = { 'platform_admin': 4, 'tenant_admin': 3, 'practice_manager': 2, 'staff': 1, 'patient': 0 };
      return (roleOrder[b.role] || 0) - (roleOrder[a.role] || 0);
    })[0];
  };

  return {
    user,
    profile,
    userRoles: userRoles || [],
    rolesLoading,
    primaryTenant: getPrimaryTenant(),
    getCurrentTenantRole,
    hasPermission,
    hasMinimumRole,
    isPlatformAdmin: userRoles?.some(role => role.role === 'platform_admin') || false,
    isTenantAdmin: (tenantId?: string) => {
      const role = getCurrentTenantRole(tenantId);
      return role?.role === 'tenant_admin' || role?.role === 'platform_admin';
    },
    canManageTenant: (tenantId?: string) => hasMinimumRole('practice_manager', tenantId),
    canAccessTenant: (tenantId?: string) => getCurrentTenantRole(tenantId) !== null,
  };
};
