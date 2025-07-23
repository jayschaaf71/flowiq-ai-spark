import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

interface AuditLogData {
  id?: string;
  user_id?: string;
  table_name: string;
  action: string;
  record_id?: string;
  old_values?: unknown;
  new_values?: unknown;
  ip_address?: unknown;
  session_id?: string | null;
  user_agent?: string;
  created_at?: string;
  tenant_id?: string;
}

interface ComplianceMetrics {
  total_patients: number;
  total_appointments: number;
  total_soap_notes: number;
  total_audit_logs: number;
  last_audit_entry: string;
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logActivity = async (
    tableName: string,
    action: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT',
    recordId?: string,
    oldValues?: unknown,
    newValues?: unknown
  ) => {
    if (!user) return;

    try {
      await supabase.from('audit_logs').insert([{
        table_name: tableName,
        action,
        record_id: recordId,
        old_values: oldValues as any,
        new_values: newValues as any,
        user_agent: navigator.userAgent
      }]);
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  };

  return { logActivity };
};

// Updated hook that accepts optional filters
export const useAuditLogs = (tableName?: string, recordId?: string) => {
  const [data, setData] = useState<AuditLogData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        let query = supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        // Apply filters if provided
        if (tableName) {
          query = query.eq('table_name', tableName);
        }
        if (recordId) {
          query = query.eq('record_id', recordId);
        }

        const { data: logs, error } = await query;

        if (error) throw error;
        setData((logs as AuditLogData[]) || []);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [tableName, recordId]);

  return { data, loading };
};

export const useComplianceMetrics = () => {
  const [data, setData] = useState<ComplianceMetrics[]>([]);
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
  metadata?: unknown
) => {
  try {
    await supabase.from('audit_logs').insert({
      table_name: tableName,
      action,
      record_id: recordId,
      new_values: metadata as any,
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
