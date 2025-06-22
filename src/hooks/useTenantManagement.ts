
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
        .order('name');
      if (error) throw error;
      return data as Tenant[];
    },
    enabled: !!user,
  });

  // Fetch user's tenant memberships
  const { data: userTenants, isLoading: userTenantsLoading } = useQuery({
    queryKey: ['user-tenants', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenant_users')
        .select(`
          *,
          tenants!tenant_users_tenant_id_fkey(*)
        `)
        .eq('user_id', user!.id)
        .eq('is_active', true);
      if (error) throw error;
      return data;
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

  // Create tenant mutation
  const createTenantMutation = useMutation({
    mutationFn: async (tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('tenants')
        .insert([tenantData])
        .select()
        .single();
      if (error) throw error;
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

  // Update tenant mutation
  const updateTenantMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Tenant> }) => {
      const { data, error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
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

  // Invite user to tenant
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
      // This would typically send an invitation email
      // For now, we'll create a placeholder entry
      const { data, error } = await supabase
        .from('tenant_users')
        .insert([{
          tenant_id: tenantId,
          user_id: user!.id, // Temporary - would be actual user ID after invitation
          role,
          invited_by: user!.id,
          invited_at: new Date().toISOString()
        }])
        .select()
        .single();
      if (error) throw error;
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
