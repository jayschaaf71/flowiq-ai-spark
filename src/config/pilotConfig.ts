/**
 * Production Pilot Configuration
 * Manages feature flags and settings for the pilot launch
 */

export interface PilotConfig {
  environment: 'pilot' | 'production' | 'development';
  tenants: {
    [key: string]: {
      name: string;
      specialty: 'chiropractic' | 'dental-sleep';
      features: PilotFeatures;
      contact: {
        email: string;
        phone: string;
        supportHours: string;
      };
    };
  };
  features: PilotFeatures;
  monitoring: {
    enabled: boolean;
    errorTracking: boolean;
    performanceMonitoring: boolean;
    userAnalytics: boolean;
  };
  support: {
    email: string;
    phone: string;
    hours: string;
    escalationContacts: string[];
  };
}

export interface PilotFeatures {
  // Core Features
  appointments: boolean;
  patients: boolean;
  ehr: boolean;
  billing: boolean;
  analytics: boolean;
  
  // AI Features
  aiScribe: boolean;
  aiClaims: boolean;
  aiScheduling: boolean;
  aiIntake: boolean;
  
  // Communication
  emailNotifications: boolean;
  smsNotifications: boolean;
  patientPortal: boolean;
  messaging: boolean;
  
  // Specialty Features
  sleepStudies: boolean; // Dental Sleep
  dmeTracking: boolean; // Dental Sleep
  spinalAdjustments: boolean; // Chiropractic
  painTracking: boolean; // Chiropractic
  
  // Advanced Features
  twoFactorAuth: boolean;
  auditLogging: boolean;
  complianceReporting: boolean;
  mobileApp: boolean;
}

export const PILOT_CONFIG: PilotConfig = {
  environment: 'pilot',
  tenants: {
    'midwest-dental-sleep': {
      name: 'Midwest Dental Sleep Medicine Institute',
      specialty: 'dental-sleep',
      features: {
        appointments: true,
        patients: true,
        ehr: true,
        billing: true,
        analytics: true,
        aiScribe: true,
        aiClaims: true,
        aiScheduling: true,
        aiIntake: true,
        emailNotifications: true,
        smsNotifications: false, // Disabled for pilot
        patientPortal: true,
        messaging: false, // Disabled for pilot
        sleepStudies: true,
        dmeTracking: true,
        spinalAdjustments: false,
        painTracking: false,
        twoFactorAuth: false, // Disabled for pilot
        auditLogging: true,
        complianceReporting: true,
        mobileApp: false // Disabled for pilot
      },
      contact: {
        email: 'support@midwestdental.com',
        phone: '(555) 123-4567',
        supportHours: 'Mon-Fri 8AM-5PM CST'
      }
    },
    'west-county-spine': {
      name: 'West County Spine and Joint',
      specialty: 'chiropractic',
      features: {
        appointments: true,
        patients: true,
        ehr: true,
        billing: true,
        analytics: true,
        aiScribe: true,
        aiClaims: true,
        aiScheduling: true,
        aiIntake: true,
        emailNotifications: true,
        smsNotifications: false, // Disabled for pilot
        patientPortal: true,
        messaging: false, // Disabled for pilot
        sleepStudies: false,
        dmeTracking: false,
        spinalAdjustments: true,
        painTracking: true,
        twoFactorAuth: false, // Disabled for pilot
        auditLogging: true,
        complianceReporting: true,
        mobileApp: false // Disabled for pilot
      },
      contact: {
        email: 'support@westcountyspine.com',
        phone: '(555) 987-6543',
        supportHours: 'Mon-Fri 8AM-5PM PST'
      }
    }
  },
  features: {
    appointments: true,
    patients: true,
    ehr: true,
    billing: true,
    analytics: true,
    aiScribe: true,
    aiClaims: true,
    aiScheduling: true,
    aiIntake: true,
    emailNotifications: true,
    smsNotifications: false,
    patientPortal: true,
    messaging: false,
    sleepStudies: true,
    dmeTracking: true,
    spinalAdjustments: true,
    painTracking: true,
    twoFactorAuth: false,
    auditLogging: true,
    complianceReporting: true,
    mobileApp: false
  },
  monitoring: {
    enabled: true,
    errorTracking: true,
    performanceMonitoring: true,
    userAnalytics: true
  },
  support: {
    email: 'pilot-support@flow-iq.ai',
    phone: '(555) 000-0000',
    hours: 'Mon-Fri 8AM-8PM EST',
    escalationContacts: [
      'technical-support@flow-iq.ai',
      'pilot-manager@flow-iq.ai'
    ]
  }
};

/**
 * Get pilot configuration for a specific tenant
 */
export function getPilotConfig(tenantId?: string): PilotConfig {
  if (tenantId && PILOT_CONFIG.tenants[tenantId]) {
    return {
      ...PILOT_CONFIG,
      features: {
        ...PILOT_CONFIG.features,
        ...PILOT_CONFIG.tenants[tenantId].features
      }
    };
  }
  return PILOT_CONFIG;
}

/**
 * Check if a feature is enabled for pilot
 */
export function isFeatureEnabled(feature: keyof PilotFeatures, tenantId?: string): boolean {
  const config = getPilotConfig(tenantId);
  return config.features[feature] || false;
}

/**
 * Get pilot status information
 */
export function getPilotStatus() {
  return {
    phase: 'pilot',
    startDate: '2024-01-15',
    expectedDuration: '8 weeks',
    participants: Object.keys(PILOT_CONFIG.tenants).length,
    featuresEnabled: Object.values(PILOT_CONFIG.features).filter(Boolean).length,
    totalFeatures: Object.keys(PILOT_CONFIG.features).length
  };
} 