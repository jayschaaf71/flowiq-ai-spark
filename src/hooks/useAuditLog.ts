
import { useState, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  created_at: string;
}

interface ComplianceMetric {
  tenant_id: string;
  total_patients: number;
  total_appointments: number;
  total_soap_notes: number;
  total_audit_logs: number;
  last_audit_entry: string | null;
}

export const useAuditLogs = () => {
  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock audit logs
        setData([
          {
            id: '1',
            user_id: 'user1',
            action: 'SELECT',
            table_name: 'patients',
            record_id: 'patient1',
            old_values: null,
            new_values: null,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: 'user1',
            action: 'UPDATE',
            table_name: 'appointments',
            record_id: 'apt1',
            old_values: { status: 'pending' },
            new_values: { status: 'confirmed' },
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        handleError(error as Error, 'Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [handleError]);

  return {
    data,
    loading,
    error: null
  };
};

export const useComplianceMetrics = () => {
  const [data, setData] = useState<ComplianceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchComplianceMetrics = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock compliance data
        setData([
          {
            tenant_id: 'default',
            total_patients: 1247,
            total_appointments: 3856,
            total_soap_notes: 2134,
            total_audit_logs: 15672,
            last_audit_entry: new Date().toISOString()
          }
        ]);
      } catch (error) {
        console.error('Error fetching compliance metrics:', error);
        handleError(error as Error, 'Failed to load compliance metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceMetrics();
  }, [handleError]);

  return {
    data,
    loading,
    error: null
  };
};
