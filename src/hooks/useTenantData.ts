
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logAuditAction } from './useAuditLog';

// Generic hook for tenant-isolated data fetching
export const useTenantData = <T>(
  tableName: string,
  queryKey: string[],
  additionalFilters?: Record<string, any>
) => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: [...queryKey, profile?.tenant_id],
    queryFn: async () => {
      if (!profile?.tenant_id) {
        throw new Error('No tenant context available');
      }

      console.log(`Fetching ${tableName} data for tenant: ${profile.tenant_id}`);
      
      let query = supabase.from(tableName).select('*');
      
      // Apply additional filters if provided
      if (additionalFilters) {
        Object.entries(additionalFilters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = await query;
      
      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        throw error;
      }

      // Log data access for HIPAA compliance
      await logAuditAction(tableName, 'bulk_read', 'SELECT', null, {
        tenant_id: profile.tenant_id,
        record_count: data?.length || 0,
        compliance_note: 'Tenant-isolated data access'
      });

      return data || [];
    },
    enabled: !!profile?.tenant_id,
  });
};

// Tenant-aware mutation hook
export const useTenantMutation = <T>(
  tableName: string,
  invalidateKeys: string[]
) => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, action, id }: { 
      data: Partial<T>, 
      action: 'insert' | 'update' | 'delete',
      id?: string 
    }) => {
      if (!profile?.tenant_id) {
        throw new Error('No tenant context available');
      }

      console.log(`Performing ${action} on ${tableName} for tenant: ${profile.tenant_id}`);

      let result;
      let oldValues = null;

      // For updates/deletes, get old values for audit trail
      if ((action === 'update' || action === 'delete') && id) {
        const { data: existing } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();
        oldValues = existing;
      }

      switch (action) {
        case 'insert':
          result = await supabase.from(tableName).insert(data).select().single();
          break;
        case 'update':
          if (!id) throw new Error('ID required for update');
          result = await supabase.from(tableName).update(data).eq('id', id).select().single();
          break;
        case 'delete':
          if (!id) throw new Error('ID required for delete');
          result = await supabase.from(tableName).delete().eq('id', id);
          break;
      }

      if (result.error) {
        throw result.error;
      }

      // Log the action for HIPAA compliance
      await logAuditAction(
        tableName, 
        id || result.data?.id || 'unknown', 
        action.toUpperCase(),
        oldValues,
        action !== 'delete' ? result.data : null
      );

      return result.data;
    },
    onSuccess: () => {
      // Invalidate related queries
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key, profile?.tenant_id] });
      });
    },
  });
};

// Specific hook for patient data with enhanced HIPAA logging
export const useTenantPatients = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['patients', profile?.tenant_id],
    queryFn: async () => {
      if (!profile?.tenant_id) {
        throw new Error('No tenant context available');
      }

      console.log(`Fetching patients for tenant: ${profile.tenant_id}`);
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }

      // Enhanced HIPAA audit logging for patient data access
      await logAuditAction('patients', 'bulk_access', 'SELECT', null, {
        tenant_id: profile.tenant_id,
        patient_count: data?.length || 0,
        access_timestamp: new Date().toISOString(),
        compliance_note: 'Patient PHI accessed - HIPAA audit trail',
        user_role: profile.role
      });

      return data || [];
    },
    enabled: !!profile?.tenant_id,
  });
};
