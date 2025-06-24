
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'platform_admin' | 'tenant_admin' | 'practice_manager' | 'staff' | 'patient';
  permissions: Record<string, any>;
  is_active: boolean;
  tenant: {
    id: string;
    name: string;
    brand_name: string;
    specialty: string;
    slug: string;
    is_active: boolean;
  };
}

export const useEnhancedAuth = () => {
  const { user, profile } = useAuth();
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  // Fetch user's tenant roles and memberships
  const { data: userRoles, isLoading: rolesQueryLoading, error: rolesQueryError } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('Fetching user roles for:', user.id);
      
      const { data, error } = await supabase
        .from('tenant_users')
        .select(`
          *,
          tenants!tenant_users_tenant_id_fkey(
            id,
            name,
            brand_name,
            specialty,
            slug,
            is_active
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching user roles:', error);
        throw error;
      }

      console.log('User roles fetched:', data);
      
      // Transform the data to match our TenantUser interface
      return (data || []).map(item => ({
        ...item,
        tenant: item.tenants // Map tenants to tenant (singular)
      })) as TenantUser[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });

  useEffect(() => {
    setRolesLoading(rolesQueryLoading);
    setRolesError(rolesQueryError?.message || null);
  }, [rolesQueryLoading, rolesQueryError]);

  // Get primary tenant (from profile or first active tenant)
  const primaryTenant = userRoles?.find(role => 
    role.tenant_id === (profile as any)?.primary_tenant_id
  ) || userRoles?.[0];

  // Check if user has minimum role in specific tenant
  const hasMinimumRole = (requiredRole: string, tenantId?: string) => {
    if (!userRoles) return false;
    
    const roleHierarchy = {
      'patient': 0,
      'staff': 1,
      'practice_manager': 2,
      'tenant_admin': 3,
      'platform_admin': 4
    };
    
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
    
    const relevantRoles = tenantId 
      ? userRoles.filter(role => role.tenant_id === tenantId)
      : userRoles;
    
    return relevantRoles.some(role => {
      const userLevel = roleHierarchy[role.role as keyof typeof roleHierarchy] || 0;
      return userLevel >= requiredLevel;
    });
  };

  // Check if user can access specific tenant
  const canAccessTenant = (tenantId: string) => {
    return userRoles?.some(role => role.tenant_id === tenantId && role.is_active) || false;
  };

  // Check if user is platform admin
  const isPlatformAdmin = userRoles?.some(role => role.role === 'platform_admin') || false;

  // Get user's role in specific tenant
  const getTenantRole = (tenantId: string) => {
    return userRoles?.find(role => role.tenant_id === tenantId)?.role || null;
  };

  return {
    user,
    profile,
    userRoles: userRoles || [],
    primaryTenant,
    rolesLoading,
    rolesError,
    hasMinimumRole,
    canAccessTenant,
    isPlatformAdmin,
    getTenantRole,
    // Helper functions
    isAuthenticated: !!user,
    hasAnyTenantAccess: (userRoles?.length || 0) > 0,
  };
};
