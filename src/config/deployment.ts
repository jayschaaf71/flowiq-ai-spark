/**
 * Production deployment configuration for FlowIQ
 */

export interface DeploymentTenant {
  id: string;
  name: string;
  subdomain: string;
  specialty: string;
  domain?: string;
  customDomain?: string;
}

export const PRODUCTION_TENANTS: DeploymentTenant[] = [
  {
    id: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    name: 'Midwest Dental Sleep Medicine Institute',
    subdomain: 'midwest-dental-sleep',
    specialty: 'dental-sleep-medicine',
    domain: 'midwest-dental-sleep.flow-iq.ai'
  },
  {
    id: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
    name: 'West County Spine and Joint',
    subdomain: 'west-county-spine',
    specialty: 'chiropractic-care',
    domain: 'west-county-spine.flow-iq.ai'
  }
];

export const DEPLOYMENT_CONFIG = {
  production: {
    domains: {
      main: 'flow-iq.ai',
      app: 'app.flow-iq.ai',
      api: 'api.flow-iq.ai'
    },
    supabase: {
      url: 'https://jnpzabmqieceoqjypvve.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHphYm1xaWVjZW9xanlwdnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTQ4NzIsImV4cCI6MjA2NDI5MDg3Mn0.RSZZj9ijOESttwNopqROh1pXqi7y4Q4TDW4_6eqcBFU'
    },
    features: {
      analytics: true,
      monitoring: true,
      errorTracking: true,
      performanceMonitoring: true
    }
  },
  staging: {
    domains: {
      main: 'staging.flow-iq.ai',
      app: 'app.staging.flow-iq.ai'
    },
    supabase: {
      url: 'https://jnpzabmqieceoqjypvve.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHphYm1xaWVjZW9xanlwdnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTQ4NzIsImV4cCI6MjA2NDI5MDg3Mn0.RSZZj9ijOESttwNopqROh1pXqi7y4Q4TDW4_6eqcBFU'
    },
    features: {
      analytics: false,
      monitoring: true,
      errorTracking: true,
      performanceMonitoring: false
    }
  }
};

export function getDeploymentConfig(environment: 'production' | 'staging' = 'production') {
  return DEPLOYMENT_CONFIG[environment];
}

export function getTenantBySubdomain(subdomain: string): DeploymentTenant | undefined {
  return PRODUCTION_TENANTS.find(tenant => tenant.subdomain === subdomain);
}

export function getTenantById(id: string): DeploymentTenant | undefined {
  return PRODUCTION_TENANTS.find(tenant => tenant.id === id);
}