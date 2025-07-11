/**
 * Deployment configuration and environment utilities
 */

export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildDate: string;
  gitHash?: string;
  features: {
    debugMode: boolean;
    analyticsEnabled: boolean;
    maintenanceMode: boolean;
  };
  apis: {
    supabaseUrl: string;
    supabaseAnonKey: string;
  };
}

// Version information (in real deployment, this would be injected at build time)
export const APP_VERSION = '1.0.0-beta';
export const BUILD_DATE = new Date().toISOString();

/**
 * Get current deployment configuration
 */
export const getDeploymentConfig = (): DeploymentConfig => {
  const isDev = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  return {
    environment: isDev ? 'development' : isProduction ? 'production' : 'staging',
    version: APP_VERSION,
    buildDate: BUILD_DATE,
    gitHash: import.meta.env.VITE_GIT_HASH || 'unknown',
    features: {
      debugMode: isDev,
      analyticsEnabled: isProduction,
      maintenanceMode: false, // This would be set via feature flags
    },
    apis: {
      supabaseUrl: 'https://jnpzabmqieceoqjypvve.supabase.co',
      supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHphYm1xaWVjZW9xanlwdnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTQ4NzIsImV4cCI6MjA2NDI5MDg3Mn0.RSZZj9ijOESttwNopqROh1pXqi7y4Q4TDW4_6eqcBFU',
    },
  };
};

/**
 * Check if we're in a specific environment
 */
export const isEnvironment = (env: 'development' | 'staging' | 'production'): boolean => {
  return getDeploymentConfig().environment === env;
};

/**
 * Get environment-specific configuration
 */
export const getEnvironmentConfig = () => {
  const config = getDeploymentConfig();
  
  return {
    isDevelopment: config.environment === 'development',
    isStaging: config.environment === 'staging',
    isProduction: config.environment === 'production',
    showDebugInfo: config.features.debugMode,
    enableAnalytics: config.features.analyticsEnabled,
    maintenanceMode: config.features.maintenanceMode,
  };
};

/**
 * Health check configuration
 */
export const getHealthCheckEndpoints = () => {
  const config = getDeploymentConfig();
  
  return {
    api: `${config.apis.supabaseUrl}/rest/v1/`,
    auth: `${config.apis.supabaseUrl}/auth/v1/health`,
    database: `${config.apis.supabaseUrl}/rest/v1/tenants?select=count`,
  };
};