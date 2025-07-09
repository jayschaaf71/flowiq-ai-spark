
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  subdomain?: string;
  brand_name: string;
  tagline?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  specialty: string;
  subscription_tier: string;
  max_forms: number;
  max_submissions: number;
  max_users: number;
  custom_branding_enabled: boolean;
  api_access_enabled: boolean;
  white_label_enabled: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'platform_admin' | 'tenant_admin' | 'practice_manager' | 'staff' | 'patient';
  permissions: Record<string, any>;
  is_active: boolean;
  invited_by?: string;
  invited_at?: string;
  joined_at?: string;
  created_at: string;
}

export interface TenantSettings {
  id: string;
  tenant_id: string;
  email_templates: Record<string, any>;
  form_templates: Record<string, any>;
  notification_settings: Record<string, any>;
  integration_settings: Record<string, any>;
  custom_fields: Record<string, any>;
  branding_settings: Record<string, any>;
  api_keys: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useTenantManagement = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all tenants (platform admin only)
  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tenants:', error);
        throw new Error(error.message);
      }
      
      // Transform to match the expected interface
      return data.map((tenant): Tenant => ({
        id: tenant.id,
        name: tenant.name,
        slug: tenant.subdomain,
        domain: undefined,
        subdomain: tenant.subdomain,
        brand_name: tenant.business_name || tenant.name,
        tagline: undefined,
        logo_url: tenant.logo_url,
        primary_color: tenant.primary_color || '#3b82f6',
        secondary_color: tenant.secondary_color || '#6366f1',
        specialty: tenant.specialty,
        subscription_tier: 'professional', // Default value
        max_forms: 50, // Default value
        max_submissions: 1000, // Default value
        max_users: 10, // Default value
        custom_branding_enabled: true, // Default value
        api_access_enabled: true, // Default value
        white_label_enabled: false, // Default value
        is_active: tenant.is_active,
        created_at: tenant.created_at,
        updated_at: tenant.updated_at
      }));
    },
    enabled: !!user,
  });

  // Fetch user's tenant memberships
  const { data: userTenants, isLoading: userTenantsLoading } = useQuery({
    queryKey: ['user-tenants', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('tenant_users')
        .select(`
          *,
          tenants (*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching user tenants:', error);
        throw new Error(error.message);
      }
      
      return data.map(item => ({
        ...item,
        tenants: item.tenants ? {
          id: item.tenants.id,
          name: item.tenants.name,
          slug: item.tenants.subdomain,
          brand_name: item.tenants.business_name || item.tenants.name,
          primary_color: item.tenants.primary_color || '#3b82f6',
          secondary_color: item.tenants.secondary_color || '#6366f1',
          specialty: item.tenants.specialty,
          subscription_tier: 'professional',
          max_forms: 50,
          max_submissions: 1000,
          max_users: 10,
          custom_branding_enabled: true,
          api_access_enabled: true,
          white_label_enabled: false,
          is_active: item.tenants.is_active,
          created_at: item.tenants.created_at,
          updated_at: item.tenants.updated_at
        } : null
      }));
    },
    enabled: !!user,
  });

  // Get current tenant
  const getCurrentTenant = () => {
    const profileTenantId = (profile as any)?.primary_tenant_id;
    if (!profileTenantId || !userTenants) return null;
    const tenantUser = userTenants.find(tu => tu.tenant_id === profileTenantId);
    return tenantUser?.tenants as Tenant;
  };

  // Create tenant mutation - mock implementation
  const createTenantMutation = useMutation({
    mutationFn: async (tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
      // Mock tenant creation since table doesn't exist
      console.log('Mock creating tenant:', tenantData);
      
      const data: Tenant = {
        ...tenantData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({ title: 'Tenant created successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to create tenant', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  // Update tenant mutation - mock implementation
  const updateTenantMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Tenant> }) => {
      // Mock tenant update since table doesn't exist
      console.log('Mock updating tenant:', id, updates);
      
      const data = {
        id,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({ title: 'Tenant updated successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to update tenant', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  // Invite user to tenant - mock implementation
  const inviteUserMutation = useMutation({
    mutationFn: async ({ 
      tenantId, 
      email, 
      role 
    }: { 
      tenantId: string; 
      email: string; 
      role: TenantUser['role'] 
    }) => {
      // Mock user invitation since table doesn't exist
      console.log('Mock inviting user:', { tenantId, email, role });
      
      const data = {
        id: Date.now().toString(),
        tenant_id: tenantId,
        user_id: user!.id,
        role,
        permissions: {},
        is_active: true,
        invited_by: user!.id,
        invited_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-users'] });
      toast({ title: 'User invited successfully' });
    },
  });

  return {
    tenants,
    tenantsLoading,
    userTenants,
    userTenantsLoading,
    currentTenant: getCurrentTenant(),
    createTenant: createTenantMutation.mutate,
    updateTenant: updateTenantMutation.mutate,
    inviteUser: inviteUserMutation.mutate,
    isCreating: createTenantMutation.isPending,
    isUpdating: updateTenantMutation.isPending,
    isInviting: inviteUserMutation.isPending,
  };
};
