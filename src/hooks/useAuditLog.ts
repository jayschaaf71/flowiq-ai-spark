
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

export const logAuditAction = async (
  tableName: string,
  recordId: string,
  action: string,
  oldValues?: any,
  newValues?: any
) => {
  try {
    await supabase.from('audit_logs').insert({
      table_name: tableName,
      record_id: recordId,
      action,
      old_values: oldValues,
      new_values: newValues,
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
};
