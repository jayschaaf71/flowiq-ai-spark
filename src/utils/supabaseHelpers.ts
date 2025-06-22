
import { supabase } from '@/integrations/supabase/client';

// Helper function to execute raw SQL queries when TypeScript types aren't available yet
export const executeRawSQL = async (sql: string, params: any[] = []) => {
  try {
    // For now, we'll use a simple approach by creating a temporary function
    // This is a workaround until the database types are regenerated
    const { data, error } = await supabase.rpc('exec_raw_sql', {
      query: sql,
      parameters: params
    });
    
    return { data, error };
  } catch (error) {
    console.error('Raw SQL execution error:', error);
    return { data: null, error };
  }
};
