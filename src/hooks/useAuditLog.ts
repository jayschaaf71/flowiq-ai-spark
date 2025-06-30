
import { useState, useEffect } from 'react';
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

// Export additional hooks that other components expect
export const useAuditLogs = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const { data: logs, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setData(logs || []);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  return { data, loading };
};

export const useComplianceMetrics = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Mock compliance data for now
        const mockData = [{
          total_patients: 150,
          total_appointments: 89,
          total_soap_notes: 145,
          total_audit_logs: 2847,
          last_audit_entry: new Date().toISOString()
        }];
        
        setData(mockData);
      } catch (error) {
        console.error('Error fetching compliance metrics:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { data, loading };
};

// Export logAuditAction function that services expect
export const logAuditAction = async (
  action: string,
  tableName: string,
  recordId?: string,
  metadata?: any
) => {
  try {
    await supabase.from('audit_logs').insert({
      table_name: tableName,
      action,
      record_id: recordId,
      new_values: metadata,
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
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
