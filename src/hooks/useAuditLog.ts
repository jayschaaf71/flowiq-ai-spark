
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type AuditLog = Tables<'audit_logs'>;

export const useAuditLogs = (tableName?: string, recordId?: string) => {
  return useQuery({
    queryKey: ['audit_logs', tableName, recordId],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (tableName) {
        query = query.eq('table_name', tableName);
      }
      if (recordId) {
        query = query.eq('record_id', recordId);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data || [];
    },
  });
};

// Enhanced audit logging function for HIPAA compliance
export const logAuditAction = async (
  tableName: string,
  recordId: string,
  action: string,
  oldValues?: any,
  newValues?: any
) => {
  try {
    // Get additional context for HIPAA audit requirements
    const userAgent = navigator.userAgent;
    const timestamp = new Date().toISOString();
    
    console.log(`HIPAA Audit Log: ${action} on ${tableName} record ${recordId} at ${timestamp}`);
    
    await supabase.from('audit_logs').insert({
      table_name: tableName,
      record_id: recordId,
      action,
      old_values: oldValues,
      new_values: newValues,
      user_agent: userAgent,
      session_id: crypto.randomUUID(), // Generate session identifier
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
    // HIPAA requires audit logging to be reliable - this is a critical error
    throw new Error('Audit logging failed - this is a HIPAA compliance violation');
  }
};

// Hook for compliance monitoring
export const useComplianceMetrics = () => {
  return useQuery({
    queryKey: ['compliance_metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_summary')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 300000, // Refresh every 5 minutes for compliance monitoring
  });
};

// Enhanced patient access logging for HIPAA
export const logPatientAccess = async (patientId: string, accessType: 'view' | 'edit' | 'create') => {
  await logAuditAction('patients', patientId, `PATIENT_${accessType.toUpperCase()}`, null, { 
    access_type: accessType,
    timestamp: new Date().toISOString(),
    compliance_note: 'PHI access logged for HIPAA compliance'
  });
};
