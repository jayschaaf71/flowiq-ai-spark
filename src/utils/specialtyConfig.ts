
export type SpecialtyType = 'chiropractic' | 'dental-sleep' | 'med-spa' | 'concierge' | 'hrt' | 'communication' | 'general-dentistry';

export interface SpecialtyConfig {
  id: SpecialtyType;
  name: string;
  description: string;
  tagline: string;
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  defaultAgents: string[];
  requiredIntegrations: string[];
  templateCategories: string[];
  workflowTemplates: string[];
}

export const specialtyConfigs: Record<SpecialtyType, SpecialtyConfig> = {
  chiropractic: {
    id: 'chiropractic',
    name: 'Chiropractic Care',
    description: 'Comprehensive spine and musculoskeletal health management',
    tagline: 'Optimizing spinal health and mobility',
    brandName: 'ChiroIQ',
    primaryColor: '#16a34a',
    secondaryColor: '#22c55e',
    accentColor: '#dcfce7',
    defaultAgents: ['appointment-iq', 'intake-iq'],
    requiredIntegrations: ['ehr', 'scheduling'],
    templateCategories: ['intake', 'soap', 'treatment-plans'],
    workflowTemplates: ['new-patient', 'follow-up', 'treatment-series']
  },
  'dental-sleep': {
    id: 'dental-sleep',
    name: 'Dental Sleep Medicine',
    description: 'Sleep apnea treatment and oral appliance therapy',
    tagline: 'Restoring quality sleep through dental solutions',
    brandName: 'SleepIQ',
    primaryColor: '#3b82f6',
    secondaryColor: '#60a5fa',
    accentColor: '#dbeafe',
    defaultAgents: ['appointment-iq', 'intake-iq', 'billing-iq'],
    requiredIntegrations: ['ehr', 'dme-billing'],
    templateCategories: ['sleep-study', 'appliance-fitting', 'follow-up'],
    workflowTemplates: ['sleep-consult', 'appliance-delivery', 'maintenance']
  },
  'general-dentistry': {
    id: 'general-dentistry',
    name: 'General Dentistry',
    description: 'Comprehensive dental care and oral health management',
    tagline: 'Comprehensive Dental Care & Oral Health',
    brandName: 'DentalIQ',
    primaryColor: '#0ea5e9',
    secondaryColor: '#38bdf8',
    accentColor: '#7dd3fc',
    defaultAgents: ['appointment-iq', 'intake-iq', 'billing-iq'],
    requiredIntegrations: ['ehr', 'scheduling', 'dental-imaging'],
    templateCategories: ['intake', 'treatment-plans', 'preventive-care'],
    workflowTemplates: ['new-patient', 'cleaning', 'restorative-care']
  },
  'med-spa': {
    id: 'med-spa',
    name: 'Medical Spa',
    description: 'Aesthetic treatments and wellness services',
    tagline: 'Enhancing natural beauty and wellness',
    brandName: 'AestheticIQ',
    primaryColor: '#ec4899',
    secondaryColor: '#f472b6',
    accentColor: '#fce7f3',
    defaultAgents: ['appointment-iq', 'assist-iq'],
    requiredIntegrations: ['pos', 'marketing'],
    templateCategories: ['consultation', 'treatment', 'aftercare'],
    workflowTemplates: ['aesthetic-consult', 'treatment-series', 'maintenance']
  },
  concierge: {
    id: 'concierge',
    name: 'Concierge Medicine',
    description: 'Personalized primary care and wellness',
    tagline: 'Premium healthcare with personalized attention',
    brandName: 'ConciergeIQ',
    primaryColor: '#7c3aed',
    secondaryColor: '#8b5cf6',
    accentColor: '#ede9fe',
    defaultAgents: ['appointment-iq', 'intake-iq', 'assist-iq'],
    requiredIntegrations: ['ehr', 'telehealth'],
    templateCategories: ['wellness', 'executive-physical', 'house-call'],
    workflowTemplates: ['membership-onboard', 'annual-physical', 'urgent-care']
  },
  hrt: {
    id: 'hrt',
    name: 'Hormone Replacement Therapy',
    description: 'Hormone optimization and anti-aging medicine',
    tagline: 'Optimizing hormonal health and vitality',
    brandName: 'HormoneIQ',
    primaryColor: '#dc2626',
    secondaryColor: '#ef4444',
    accentColor: '#fee2e2',
    defaultAgents: ['appointment-iq', 'intake-iq'],
    requiredIntegrations: ['ehr', 'lab', 'compounding-pharmacy'],
    templateCategories: ['hormone-assessment', 'lab-review', 'adjustment'],
    workflowTemplates: ['initial-consult', 'lab-follow-up', 'optimization']
  },
  communication: {
    id: 'communication',
    name: 'Business Communication',
    description: 'Smart business communication and scheduling platform',
    tagline: 'Smart Business Communication & Scheduling',
    brandName: 'FlowIQ Connect',
    primaryColor: '#0ea5e9',
    secondaryColor: '#38bdf8',
    accentColor: '#7dd3fc',
    defaultAgents: ['communication-iq', 'scheduling-iq'],
    requiredIntegrations: ['calendar', 'sms', 'email'],
    templateCategories: ['appointment', 'reminder', 'follow-up'],
    workflowTemplates: ['new-customer', 'appointment-confirmation', 'follow-up']
  }
};

export const getSpecialtyConfig = (specialty: SpecialtyType): SpecialtyConfig => {
  return specialtyConfigs[specialty];
};

export const getAllSpecialties = (): SpecialtyConfig[] => {
  return Object.values(specialtyConfigs);
};
