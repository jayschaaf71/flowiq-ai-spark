
export type SpecialtyType = 'chiropractic' | 'dental-sleep' | 'med-spa' | 'concierge' | 'hrt';

export interface SpecialtyConfig {
  id: SpecialtyType;
  name: string;
  description: string;
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
    defaultAgents: ['receptionist', 'scribe', 'reminder'],
    requiredIntegrations: ['ehr', 'scheduling'],
    templateCategories: ['intake', 'soap', 'treatment-plans'],
    workflowTemplates: ['new-patient', 'follow-up', 'treatment-series']
  },
  'dental-sleep': {
    id: 'dental-sleep',
    name: 'Dental Sleep Medicine',
    description: 'Sleep apnea treatment and oral appliance therapy',
    defaultAgents: ['receptionist', 'follow-up', 'billing'],
    requiredIntegrations: ['ehr', 'dme-billing'],
    templateCategories: ['sleep-study', 'appliance-fitting', 'follow-up'],
    workflowTemplates: ['sleep-consult', 'appliance-delivery', 'maintenance']
  },
  'med-spa': {
    id: 'med-spa',
    name: 'Medical Spa',
    description: 'Aesthetic treatments and wellness services',
    defaultAgents: ['receptionist', 'marketing', 'follow-up'],
    requiredIntegrations: ['pos', 'marketing'],
    templateCategories: ['consultation', 'treatment', 'aftercare'],
    workflowTemplates: ['aesthetic-consult', 'treatment-series', 'maintenance']
  },
  concierge: {
    id: 'concierge',
    name: 'Concierge Medicine',
    description: 'Personalized primary care and wellness',
    defaultAgents: ['receptionist', 'care-coordinator', 'wellness'],
    requiredIntegrations: ['ehr', 'telehealth'],
    templateCategories: ['wellness', 'executive-physical', 'house-call'],
    workflowTemplates: ['membership-onboard', 'annual-physical', 'urgent-care']
  },
  hrt: {
    id: 'hrt',
    name: 'Hormone Replacement Therapy',
    description: 'Hormone optimization and anti-aging medicine',
    defaultAgents: ['receptionist', 'lab-coordinator', 'follow-up'],
    requiredIntegrations: ['ehr', 'lab', 'compounding-pharmacy'],
    templateCategories: ['hormone-assessment', 'lab-review', 'adjustment'],
    workflowTemplates: ['initial-consult', 'lab-follow-up', 'optimization']
  }
};

export const getSpecialtyConfig = (specialty: SpecialtyType): SpecialtyConfig => {
  return specialtyConfigs[specialty];
};

export const getAllSpecialties = (): SpecialtyConfig[] => {
  return Object.values(specialtyConfigs);
};
