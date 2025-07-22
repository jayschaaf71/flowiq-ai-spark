import { supabase } from '@/integrations/supabase/client';
import { getDeploymentConfig } from '@/utils/deploymentConfig';

// Health check endpoint for monitoring
export const healthCheck = async () => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('tenants').select('count').limit(1);
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: getDeploymentConfig().version,
      environment: getDeploymentConfig().environment,
      services: {
        supabase: error ? 'error' : 'connected',
        database: error ? 'error' : 'healthy'
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};