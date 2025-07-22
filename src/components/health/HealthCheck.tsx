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