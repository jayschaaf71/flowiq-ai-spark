
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

  // Fetch all tenants (platform admin only) - mock data
  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      // Mock tenants data since table doesn't exist
      console.log('Using mock tenants data');
      
      const mockTenants: Tenant[] = [
        {
          id: '1',
          name: 'Smith Medical Practice',
          slug: 'smith-medical',
          brand_name: 'Smith Clinic',
          primary_color: '#3b82f6',
          secondary_color: '#6366f1',
          specialty: 'general',
          subscription_tier: 'professional',
          max_forms: 50,
          max_submissions: 1000,
          max_users: 10,
          custom_branding_enabled: true,
          api_access_enabled: true,
          white_label_enabled: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockTenants;
    },
    enabled: !!user,
  });

  // Fetch user's tenant memberships - mock data
  const { data: userTenants, isLoading: userTenantsLoading } = useQuery({
    queryKey: ['user-tenants', user?.id],
    queryFn: async () => {
      // Mock user tenants data since table doesn't exist
      console.log('Using mock user tenants data');
      
      const mockUserTenants = [
        {
          id: '1',
          tenant_id: '1',
          user_id: user!.id,
          role: 'tenant_admin' as const,
          permissions: {},
          is_active: true,
          created_at: new Date().toISOString(),
          tenants: {
            id: '1',
            name: 'Smith Medical Practice',
            slug: 'smith-medical',
            brand_name: 'Smith Clinic',
            primary_color: '#3b82f6',
            secondary_color: '#6366f1',
            specialty: 'general',
            subscription_tier: 'professional',
            max_forms: 50,
            max_submissions: 1000,
            max_users: 10,
            custom_branding_enabled: true,
            api_access_enabled: true,
            white_label_enabled: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      ];
      
      return mockUserTenants;
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
