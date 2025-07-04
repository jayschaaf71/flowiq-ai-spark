import { SpecialtyType } from './specialtyConfig';

export interface PatientPortalFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  component?: string;
}

export interface AppointmentTypeConfig {
  id: string;
  name: string;
  duration: number; // in minutes
  description: string;
  requiredForms?: string[];
  allowOnlineBooking: boolean;
  color?: string;
}

export interface PatientPortalConfig {
  specialty: SpecialtyType;
  features: PatientPortalFeature[];
  appointmentTypes: AppointmentTypeConfig[];
  requiredIntakeForms: string[];
  healthMetrics: string[];
  specialtySpecificSections: {
    healthTracker?: {
      metrics: string[];
      frequency: 'daily' | 'weekly' | 'monthly';
    };
    educationContent?: {
      categories: string[];
      featured: string[];
    };
    specialtyTerms?: Record<string, string>;
  };
  customization: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    brandName: string;
    welcomeMessage: string;
    footerText: string;
  };
}

export const patientPortalConfigs: Record<SpecialtyType, PatientPortalConfig> = {
  chiropractic: {
    specialty: 'chiropractic',
    features: [
      { id: 'appointments', name: 'Appointments', description: 'Schedule and manage visits', enabled: true, icon: 'Calendar' },
      { id: 'health-records', name: 'Health Records', description: 'View treatment history', enabled: true, icon: 'FileText' },
      { id: 'health-tracker', name: 'Pain Tracker', description: 'Track pain levels and mobility', enabled: true, icon: 'Heart' },
      { id: 'exercise-plan', name: 'Exercise Plans', description: 'View prescribed exercises', enabled: true, icon: 'Activity' },
      { id: 'billing', name: 'Billing', description: 'View and pay bills', enabled: true, icon: 'CreditCard' },
      { id: 'education', name: 'Education', description: 'Spinal health resources', enabled: true, icon: 'BookOpen' }
    ],
    appointmentTypes: [
      { id: 'initial-consultation', name: 'Initial Consultation', duration: 60, description: 'Comprehensive evaluation and examination', allowOnlineBooking: true, color: '#16a34a' },
      { id: 'adjustment', name: 'Chiropractic Adjustment', duration: 30, description: 'Spinal adjustment treatment', allowOnlineBooking: true, color: '#22c55e' },
      { id: 'therapy-session', name: 'Physical Therapy', duration: 45, description: 'Therapeutic exercise session', allowOnlineBooking: true, color: '#15803d' },
      { id: 'follow-up', name: 'Follow-up Visit', duration: 20, description: 'Progress evaluation', allowOnlineBooking: true, color: '#166534' }
    ],
    requiredIntakeForms: ['health-history', 'pain-assessment', 'insurance-verification'],
    healthMetrics: ['pain-level', 'mobility-score', 'daily-activities', 'sleep-quality'],
    specialtySpecificSections: {
      healthTracker: {
        metrics: ['pain-level', 'mobility', 'exercise-compliance'],
        frequency: 'daily'
      },
      educationContent: {
        categories: ['spinal-health', 'posture', 'ergonomics', 'exercise'],
        featured: ['proper-lifting-techniques', 'desk-posture-tips']
      },
      specialtyTerms: {
        'visit': 'adjustment',
        'treatment': 'adjustment',
        'provider': 'chiropractor'
      }
    },
    customization: {
      primaryColor: '#16a34a',
      secondaryColor: '#22c55e',
      accentColor: '#dcfce7',
      brandName: 'ChiroIQ',
      welcomeMessage: 'Welcome to your spinal health journey',
      footerText: 'Optimizing your spinal health and mobility'
    }
  },
  'dental-sleep': {
    specialty: 'dental-sleep',
    features: [
      { id: 'appointments', name: 'Appointments', description: 'Schedule consultations and fittings', enabled: true, icon: 'Calendar' },
      { id: 'health-records', name: 'Sleep Records', description: 'View sleep studies and treatment', enabled: true, icon: 'FileText' },
      { id: 'health-tracker', name: 'Sleep Tracker', description: 'Track sleep quality and AHI', enabled: true, icon: 'Moon' },
      { id: 'appliance-care', name: 'Appliance Care', description: 'Care instructions and maintenance', enabled: true, icon: 'Shield' },
      { id: 'billing', name: 'Billing & Insurance', description: 'DME billing and insurance', enabled: true, icon: 'CreditCard' },
      { id: 'education', name: 'Sleep Education', description: 'Sleep apnea resources', enabled: true, icon: 'BookOpen' }
    ],
    appointmentTypes: [
      { id: 'initial-consult', name: 'Initial Consultation', duration: 90, description: 'Sleep apnea evaluation and treatment planning', allowOnlineBooking: true, color: '#3b82f6' },
      { id: 'appliance-fitting', name: 'Appliance Fitting', duration: 60, description: 'Custom oral appliance fitting', allowOnlineBooking: true, color: '#60a5fa' },
      { id: 'follow-up', name: 'Follow-up Visit', duration: 30, description: 'Treatment progress evaluation', allowOnlineBooking: true, color: '#2563eb' },
      { id: 'appliance-adjustment', name: 'Appliance Adjustment', duration: 30, description: 'Oral appliance fine-tuning', allowOnlineBooking: true, color: '#1d4ed8' }
    ],
    requiredIntakeForms: ['sleep-history', 'epworth-sleepiness-scale', 'insurance-verification'],
    healthMetrics: ['sleep-quality', 'ahi-score', 'compliance-hours', 'daytime-sleepiness'],
    specialtySpecificSections: {
      healthTracker: {
        metrics: ['sleep-hours', 'ahi-score', 'appliance-compliance'],
        frequency: 'daily'
      },
      educationContent: {
        categories: ['sleep-apnea', 'oral-appliances', 'cpap-alternatives', 'sleep-hygiene'],
        featured: ['what-is-sleep-apnea', 'oral-appliance-care']
      },
      specialtyTerms: {
        'visit': 'appointment',
        'treatment': 'therapy',
        'provider': 'sleep specialist'
      }
    },
    customization: {
      primaryColor: '#3b82f6',
      secondaryColor: '#60a5fa',
      accentColor: '#dbeafe',
      brandName: 'SleepIQ',
      welcomeMessage: 'Your journey to better sleep starts here',
      footerText: 'Restoring quality sleep through dental solutions'
    }
  },
  'med-spa': {
    specialty: 'med-spa',
    features: [
      { id: 'appointments', name: 'Appointments', description: 'Book treatments and consultations', enabled: true, icon: 'Calendar' },
      { id: 'treatment-history', name: 'Treatment History', description: 'View past and upcoming treatments', enabled: true, icon: 'FileText' },
      { id: 'progress-photos', name: 'Progress Photos', description: 'Before and after photos', enabled: true, icon: 'Camera' },
      { id: 'product-recommendations', name: 'Skincare Products', description: 'Recommended products and refills', enabled: true, icon: 'Package' },
      { id: 'billing', name: 'Billing & Packages', description: 'Treatment packages and billing', enabled: true, icon: 'CreditCard' },
      { id: 'rewards', name: 'Loyalty Rewards', description: 'Points and special offers', enabled: true, icon: 'Gift' }
    ],
    appointmentTypes: [
      { id: 'consultation', name: 'Aesthetic Consultation', duration: 45, description: 'Treatment planning and skin analysis', allowOnlineBooking: true, color: '#ec4899' },
      { id: 'facial', name: 'Medical Facial', duration: 60, description: 'Professional facial treatment', allowOnlineBooking: true, color: '#f472b6' },
      { id: 'injectable', name: 'Injectable Treatment', duration: 30, description: 'Botox, fillers, and other injectables', allowOnlineBooking: false, color: '#db2777' },
      { id: 'laser-treatment', name: 'Laser Treatment', duration: 45, description: 'Laser skin treatments', allowOnlineBooking: false, color: '#be185d' }
    ],
    requiredIntakeForms: ['aesthetic-consultation', 'medical-history', 'consent-forms'],
    healthMetrics: ['skin-condition', 'treatment-satisfaction', 'side-effects'],
    specialtySpecificSections: {
      healthTracker: {
        metrics: ['skin-condition', 'treatment-response', 'product-usage'],
        frequency: 'weekly'
      },
      educationContent: {
        categories: ['skincare', 'anti-aging', 'treatment-aftercare', 'product-education'],
        featured: ['pre-treatment-prep', 'post-treatment-care']
      },
      specialtyTerms: {
        'visit': 'treatment session',
        'treatment': 'aesthetic procedure',
        'provider': 'aesthetician'
      }
    },
    customization: {
      primaryColor: '#ec4899',
      secondaryColor: '#f472b6',
      accentColor: '#fce7f3',
      brandName: 'AestheticIQ',
      welcomeMessage: 'Enhance your natural beauty',
      footerText: 'Enhancing natural beauty and wellness'
    }
  },
  concierge: {
    specialty: 'concierge',
    features: [
      { id: 'appointments', name: 'Appointments', description: 'Schedule visits and house calls', enabled: true, icon: 'Calendar' },
      { id: 'health-records', name: 'Health Records', description: 'Complete medical records', enabled: true, icon: 'FileText' },
      { id: 'health-tracker', name: 'Health Tracker', description: 'Comprehensive health monitoring', enabled: true, icon: 'Heart' },
      { id: 'direct-messaging', name: 'Direct Messaging', description: '24/7 provider communication', enabled: true, icon: 'MessageSquare' },
      { id: 'lab-results', name: 'Lab Results', description: 'Test results and interpretations', enabled: true, icon: 'TestTube' },
      { id: 'membership', name: 'Membership', description: 'Membership benefits and billing', enabled: true, icon: 'Crown' }
    ],
    appointmentTypes: [
      { id: 'annual-physical', name: 'Annual Physical', duration: 90, description: 'Comprehensive annual examination', allowOnlineBooking: true, color: '#7c3aed' },
      { id: 'consultation', name: 'Consultation', duration: 45, description: 'Medical consultation', allowOnlineBooking: true, color: '#8b5cf6' },
      { id: 'house-call', name: 'House Call', duration: 60, description: 'In-home medical visit', allowOnlineBooking: false, color: '#6d28d9' },
      { id: 'wellness-visit', name: 'Wellness Visit', duration: 30, description: 'Preventive health visit', allowOnlineBooking: true, color: '#5b21b6' }
    ],
    requiredIntakeForms: ['comprehensive-health-history', 'family-history', 'lifestyle-assessment'],
    healthMetrics: ['blood-pressure', 'weight', 'cholesterol', 'glucose', 'wellness-score'],
    specialtySpecificSections: {
      healthTracker: {
        metrics: ['vitals', 'symptoms', 'medications', 'lifestyle-factors'],
        frequency: 'daily'
      },
      educationContent: {
        categories: ['preventive-care', 'wellness', 'nutrition', 'exercise'],
        featured: ['annual-health-screening', 'nutrition-guidelines']
      },
      specialtyTerms: {
        'visit': 'consultation',
        'treatment': 'care',
        'provider': 'physician'
      }
    },
    customization: {
      primaryColor: '#7c3aed',
      secondaryColor: '#8b5cf6',
      accentColor: '#ede9fe',
      brandName: 'ConciergeIQ',
      welcomeMessage: 'Premium healthcare, personalized for you',
      footerText: 'Premium healthcare with personalized attention'
    }
  },
  hrt: {
    specialty: 'hrt',
    features: [
      { id: 'appointments', name: 'Appointments', description: 'HRT consultations and follow-ups', enabled: true, icon: 'Calendar' },
      { id: 'health-records', name: 'Hormone Records', description: 'Treatment history and progress', enabled: true, icon: 'FileText' },
      { id: 'health-tracker', name: 'Symptom Tracker', description: 'Track hormone-related symptoms', enabled: true, icon: 'TrendingUp' },
      { id: 'lab-results', name: 'Lab Results', description: 'Hormone level testing', enabled: true, icon: 'TestTube' },
      { id: 'medication', name: 'Medications', description: 'HRT prescriptions and refills', enabled: true, icon: 'Pill' },
      { id: 'billing', name: 'Billing', description: 'Treatment and lab billing', enabled: true, icon: 'CreditCard' }
    ],
    appointmentTypes: [
      { id: 'initial-consult', name: 'Initial HRT Consultation', duration: 75, description: 'Comprehensive hormone evaluation', allowOnlineBooking: true, color: '#dc2626' },
      { id: 'follow-up', name: 'HRT Follow-up', duration: 30, description: 'Treatment progress review', allowOnlineBooking: true, color: '#ef4444' },
      { id: 'lab-review', name: 'Lab Review', duration: 30, description: 'Discuss hormone test results', allowOnlineBooking: true, color: '#b91c1c' },
      { id: 'adjustment', name: 'Treatment Adjustment', duration: 20, description: 'Medication or dosage adjustments', allowOnlineBooking: true, color: '#991b1b' }
    ],
    requiredIntakeForms: ['hormone-assessment', 'symptom-questionnaire', 'medical-history'],
    healthMetrics: ['energy-level', 'mood-score', 'sleep-quality', 'libido', 'hot-flashes'],
    specialtySpecificSections: {
      healthTracker: {
        metrics: ['symptoms', 'energy-level', 'mood', 'sleep-quality'],
        frequency: 'daily'
      },
      educationContent: {
        categories: ['hormone-health', 'menopause', 'andropause', 'lifestyle'],
        featured: ['understanding-hormones', 'hrt-benefits-risks']
      },
      specialtyTerms: {
        'visit': 'consultation',
        'treatment': 'hormone therapy',
        'provider': 'hormone specialist'
      }
    },
    customization: {
      primaryColor: '#dc2626',
      secondaryColor: '#ef4444',
      accentColor: '#fee2e2',
      brandName: 'HormoneIQ',
      welcomeMessage: 'Optimize your hormonal health',
      footerText: 'Optimizing hormonal health and vitality'
    }
  }
};

export const getPatientPortalConfig = (specialty: string): PatientPortalConfig => {
  // Normalize specialty string to match our keys
  const normalizedSpecialty = specialty.toLowerCase()
    .replace(/\s+/g, '-')
    .replace('care', '')
    .replace('-medicine', '')
    .trim();
  
  // Handle common variations
  const specialtyMap: Record<string, SpecialtyType> = {
    'chiropractic': 'chiropractic',
    'chiropractic-': 'chiropractic',
    'dental-sleep': 'dental-sleep',
    'dental-sleep-': 'dental-sleep',
    'med-spa': 'med-spa',
    'medical-spa': 'med-spa',
    'concierge': 'concierge',
    'hrt': 'hrt',
    'hormone-replacement-therapy': 'hrt'
  };
  
  const mappedSpecialty = specialtyMap[normalizedSpecialty] || 'chiropractic';
  return patientPortalConfigs[mappedSpecialty];
};

export const getAppointmentTypesForSpecialty = (specialty: string): AppointmentTypeConfig[] => {
  const config = getPatientPortalConfig(specialty);
  return config.appointmentTypes;
};

export const getEnabledFeaturesForSpecialty = (specialty: string): PatientPortalFeature[] => {
  const config = getPatientPortalConfig(specialty);
  return config.features.filter(feature => feature.enabled);
};