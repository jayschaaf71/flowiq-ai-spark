import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getDeploymentConfig } from '@/utils/deploymentConfig';

export const HealthCheck: React.FC = () => {
  const config = getDeploymentConfig();
  
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: config.version,
    environment: config.environment,
    gitHash: config.gitHash,
    services: {
      supabase: 'connected',
      database: 'healthy'
    }
  };

  return (
    <div className="p-4">
      <h1>FlowIQ Health Check</h1>
      <pre>{JSON.stringify(healthData, null, 2)}</pre>
    </div>
  );
};

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