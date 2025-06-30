
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

export const useAuditLog = () => {
  const { user } = useAuth();

  const logActivity = async (
    tableName: string,
    action: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT',
    recordId?: string,
    oldValues?: any,
    newValues?: any
  ) => {
    if (!user) return;

    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        table_name: tableName,
        action,
        record_id: recordId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: null, // Will be populated by database trigger
        session_id: null, // Will be populated by database trigger
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  };

  return { logActivity };
};

// Helper function for logging patient data access (HIPAA compliance)
export const logPatientAccess = async (patientId: string, action: string) => {
  try {
    await supabase.from('audit_logs').insert({
      table_name: 'patients',
      action: 'SELECT',
      record_id: patientId,
      new_values: { access_type: action, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Failed to log patient access:', error);
  }
};
