/**
 * Practice-specific configurations for West County Spine and Midwest Dental Sleep
 */

export interface PracticeConfig {
  id: string;
  name: string;
  subdomain: string;
  specialty: string;
  appointmentTypes: string[];
  formTemplates: string[];
  workingHours: {
    [key: string]: { start: string; end: string; } | null;
  };
  timezone: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export const PRACTICE_CONFIGS: Record<string, PracticeConfig> = {
  'west-county-spine': {
    id: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
    name: 'West County Spine and Joint',
    subdomain: 'west-county-spine',
    specialty: 'chiropractic-care',
    appointmentTypes: [
      'Initial Consultation',
      'Adjustment Session',
      'Spinal Decompression',
      'Physical Therapy',
      'Massage Therapy',
      'Follow-up Visit',
      'Re-examination',
      'X-Ray Consultation'
    ],
    formTemplates: [
      'chiro-intake',
      'pain-assessment',
      'medical-history',
      'insurance-verification',
      'spinal-health-questionnaire',
      'lifestyle-assessment'
    ],
    workingHours: {
      monday: { start: '08:00', end: '18:00' },
      tuesday: { start: '08:00', end: '18:00' },
      wednesday: { start: '08:00', end: '18:00' },
      thursday: { start: '08:00', end: '18:00' },
      friday: { start: '08:00', end: '16:00' },
      saturday: { start: '09:00', end: '13:00' },
      sunday: null
    },
    timezone: 'America/Chicago',
    colors: {
      primary: '#2563eb', // Blue
      secondary: '#10b981'  // Green
    }
  },
  'midwest-dental-sleep': {
    id: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    name: 'Midwest Dental Sleep Medicine Institute',
    subdomain: 'midwest-dental-sleep',
    specialty: 'dental-sleep-medicine',
    appointmentTypes: [
      'Sleep Study Consultation',
      'CPAP Follow-up',
      'Oral Appliance Fitting',
      'Oral Appliance Adjustment',
      'Sleep Study Review',
      'TMJ Evaluation',
      'Airway Assessment',
      'Appliance Delivery',
      'Progress Check'
    ],
    formTemplates: [
      'sleep-health-questionnaire',
      'epworth-sleepiness-scale',
      'medical-history',
      'insurance-verification',
      'sleep-study-intake',
      'cpap-tolerance-assessment',
      'oral-appliance-evaluation'
    ],
    workingHours: {
      monday: { start: '07:00', end: '17:00' },
      tuesday: { start: '07:00', end: '17:00' },
      wednesday: { start: '07:00', end: '17:00' },
      thursday: { start: '07:00', end: '17:00' },
      friday: { start: '07:00', end: '15:00' },
      saturday: null,
      sunday: null
    },
    timezone: 'America/Chicago',
    colors: {
      primary: '#7c3aed', // Purple
      secondary: '#06b6d4'  // Cyan
    }
  }
};

export const getPracticeConfig = (subdomain: string): PracticeConfig | null => {
  return PRACTICE_CONFIGS[subdomain] || null;
};

export const getPracticeByTenantId = (tenantId: string): PracticeConfig | null => {
  return Object.values(PRACTICE_CONFIGS).find(config => config.id === tenantId) || null;
};

export const isWorkingDay = (config: PracticeConfig, dayOfWeek: string): boolean => {
  return config.workingHours[dayOfWeek.toLowerCase()] !== null;
};

export const getWorkingHours = (config: PracticeConfig, dayOfWeek: string) => {
  return config.workingHours[dayOfWeek.toLowerCase()];
};