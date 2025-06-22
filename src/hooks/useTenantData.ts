
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logPatientAccess } from './useAuditLog';

// Enhanced hook for patient data with strict tenant isolation
export const useTenantPatients = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['patients', profile?.primary_tenant_id],
    queryFn: async () => {
      if (!profile?.id) {
        throw new Error('User not authenticated');
      }

      console.log(`Fetching patients for authenticated user with tenant context`);
      
      // Query will be automatically filtered by RLS policies
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }

      // Log patient data access for HIPAA compliance
      if (data && data.length > 0) {
        await logPatientAccess('bulk_access', 'view');
      }

      return data || [];
    },
    enabled: !!profile?.id,
  });
};

// Enhanced hook for intake submissions with tenant isolation
export const useTenantIntakeSubmissions = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['intake_submissions', profile?.primary_tenant_id],
    queryFn: async () => {
      if (!profile?.id) {
        throw new Error('User not authenticated');
      }

      console.log(`Fetching intake submissions for tenant: ${profile.primary_tenant_id}`);
      
      // Get tenant-specific forms first
      const { data: forms, error: formsError } = await supabase
        .from('intake_forms')
        .select('id')
        .eq('tenant_id', profile.primary_tenant_id);

      if (formsError) {
        console.error('Error fetching forms:', formsError);
        throw formsError;
      }

      if (!forms || forms.length === 0) {
        return [];
      }

      const formIds = forms.map(f => f.id);

      // Get submissions for tenant forms - RLS will further filter
      const { data, error } = await supabase
        .from('intake_submissions')
        .select('*')
        .in('form_id', formIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching intake submissions:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!profile?.id && !!profile?.primary_tenant_id,
  });
};

// Enhanced hook for appointments with tenant isolation
export const useTenantAppointments = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['appointments', profile?.primary_tenant_id],
    queryFn: async () => {
      if (!profile?.id) {
        throw new Error('User not authenticated');
      }

      console.log(`Fetching appointments for tenant context`);
      
      // RLS policies will automatically filter by tenant
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!profile?.id,
  });
};
