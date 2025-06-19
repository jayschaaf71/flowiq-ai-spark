
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logAuditAction } from './useAuditLog';

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

// Hook for intake submissions with tenant isolation
export const useTenantIntakeSubmissions = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['intake_submissions', profile?.tenant_id],
    queryFn: async () => {
      if (!profile?.tenant_id) {
        throw new Error('No tenant context available');
      }

      console.log(`Fetching intake submissions for tenant: ${profile.tenant_id}`);
      
      // First get forms for this tenant
      const { data: forms, error: formsError } = await supabase
        .from('intake_forms')
        .select('id')
        .eq('tenant_type', profile.tenant_id);

      if (formsError) {
        console.error('Error fetching forms:', formsError);
        throw formsError;
      }

      if (!forms || forms.length === 0) {
        return [];
      }

      const formIds = forms.map(f => f.id);

      // Then get submissions for those forms
      const { data, error } = await supabase
        .from('intake_submissions')
        .select('*')
        .in('form_id', formIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching intake submissions:', error);
        throw error;
      }

      // Log data access for HIPAA compliance
      await logAuditAction('intake_submissions', 'bulk_read', 'SELECT', null, {
        tenant_id: profile.tenant_id,
        record_count: data?.length || 0,
        compliance_note: 'Tenant-isolated data access'
      });

      return data || [];
    },
    enabled: !!profile?.tenant_id,
  });
};

// Hook for appointments with tenant isolation
export const useTenantAppointments = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['appointments', profile?.tenant_id],
    queryFn: async () => {
      if (!profile?.tenant_id) {
        throw new Error('No tenant context available');
      }

      console.log(`Fetching appointments for tenant: ${profile.tenant_id}`);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      // Log data access for HIPAA compliance
      await logAuditAction('appointments', 'bulk_read', 'SELECT', null, {
        tenant_id: profile.tenant_id,
        record_count: data?.length || 0,
        compliance_note: 'Tenant-isolated appointment data access'
      });

      return data || [];
    },
    enabled: !!profile?.tenant_id,
  });
};
