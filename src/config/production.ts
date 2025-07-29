/**
 * Production Configuration for FlowIQ
 * Manages production environment settings and domain routing
 */

export const PRODUCTION_CONFIG = {
  // Production URLs
  urls: {
    main: 'https://flowiq-ai-spark-m1i9kpmjs-flow-iq.vercel.app',
    midwestDental: 'https://midwest-dental-sleep.flow-iq.ai',
    westCountySpine: 'https://west-county-spine.flow-iq.ai',
    api: 'https://api.flow-iq.ai'
  },
  
  // Supabase Configuration
  supabase: {
    url: 'https://jnpzabmqieceoqjypvve.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHphYm1xaWVjZW9xanlwdnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTQ4NzIsImV4cCI6MjA2NDI5MDg3Mn0.RSZZj9ijOESttwNopqROh1pXqi7y4Q4TDW4_6eqcBFU'
  },
  
  // Tenant Configuration
  tenants: {
    'midwest-dental-sleep': {
      id: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
      name: 'Midwest Dental Sleep Medicine Institute',
      specialty: 'dental-sleep-medicine',
      domain: 'midwest-dental-sleep.flow-iq.ai',
      features: {
        sleepStudies: true,
        dmeTracking: true,
        spinalAdjustments: false,
        painTracking: false
      }
    },
    'west-county-spine': {
      id: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
      name: 'West County Spine and Joint',
      specialty: 'chiropractic-care',
      domain: 'west-county-spine.flow-iq.ai',
      features: {
        sleepStudies: false,
        dmeTracking: false,
        spinalAdjustments: true,
        painTracking: true
      }
    }
  },
  
  // Feature Flags for Production
  features: {
    // Core Features
    appointments: true,
    patients: true,
    ehr: true,
    billing: true,
    analytics: true,
    
    // AI Features
    aiScribe: true,
    aiClaims: true,
    aiScheduling: true,
    aiIntake: true,
    
    // Communication
    emailNotifications: true,
    smsNotifications: false, // Disabled for pilot
    patientPortal: true,
    messaging: false, // Disabled for pilot
    
    // Security
    twoFactorAuth: false, // Disabled for pilot
    auditLogging: true,
    complianceReporting: true,
    
    // Mobile
    mobileApp: false // Disabled for pilot
  },
  
  // Monitoring Configuration
  monitoring: {
    errorTracking: true,
    performanceMonitoring: true,
    userAnalytics: true,
    healthChecks: true
  },
  
  // Support Configuration
  support: {
    email: 'production-support@flow-iq.ai',
    phone: '(555) 000-0000',
    hours: 'Mon-Fri 8AM-8PM EST',
    escalationContacts: [
      'technical-support@flow-iq.ai',
      'production-manager@flow-iq.ai'
    ]
  }
};

/**
 * Get production configuration for a specific tenant
 */
export function getProductionConfig(tenantId?: string) {
  if (tenantId && PRODUCTION_CONFIG.tenants[tenantId]) {
    return {
      ...PRODUCTION_CONFIG,
      tenant: PRODUCTION_CONFIG.tenants[tenantId]
    };
  }
  return PRODUCTION_CONFIG;
}

/**
 * Check if a feature is enabled in production
 */
export function isProductionFeatureEnabled(feature: keyof typeof PRODUCTION_CONFIG.features): boolean {
  return PRODUCTION_CONFIG.features[feature] || false;
}

/**
 * Get production status
 */
export function getProductionStatus() {
  return {
    environment: 'production',
    deploymentDate: new Date().toISOString(),
    version: '1.0.0-pilot',
    tenants: Object.keys(PRODUCTION_CONFIG.tenants).length,
    featuresEnabled: Object.values(PRODUCTION_CONFIG.features).filter(Boolean).length,
    totalFeatures: Object.keys(PRODUCTION_CONFIG.features).length
  };
} 