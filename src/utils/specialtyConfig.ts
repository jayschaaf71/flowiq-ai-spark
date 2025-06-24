
export type SpecialtyType = 'chiropractic' | 'dental_sleep' | 'med_spa' | 'concierge' | 'hrt';

export interface SpecialtyConfig {
  id: SpecialtyType;
  name: string;
  brandName: string;
  description: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  iconUrl: string;
  heroImage: string;
  specialtyFocus: string;
  patientTypes: string[];
  commonProcedures: string[];
  billingCodes: { code: string; description: string; fee: number }[];
  appointmentTypes: string[];
  formTemplates: string[];
  dashboardMetrics: string[];
  workflowPriorities: string[];
}

export const specialtyConfigs: Record<SpecialtyType, SpecialtyConfig> = {
  chiropractic: {
    id: 'chiropractic',
    name: 'West County Spine & Joint',
    brandName: 'Chiro IQ',
    description: 'Complete practice management for chiropractic care with specialized spinal health workflows',
    tagline: 'Advanced Spinal Care Management',
    primaryColor: '#16A34A',
    secondaryColor: '#059669',
    accentColor: '#34D399',
    logoUrl: '/chiro-logo.svg',
    iconUrl: '/chiro-icon.svg',
    heroImage: '/chiro-hero.jpg',
    specialtyFocus: 'Spinal Health & Joint Care',
    patientTypes: ['Acute Pain', 'Chronic Conditions', 'Sports Injuries', 'Wellness Care'],
    commonProcedures: ['Spinal Adjustment', 'Physical Therapy', 'Massage Therapy', 'Decompression'],
    billingCodes: [
      { code: '98940', description: 'CMT 1-2 regions', fee: 65 },
      { code: '98941', description: 'CMT 3-4 regions', fee: 85 },
      { code: '97110', description: 'Therapeutic exercises', fee: 45 }
    ],
    appointmentTypes: ['Initial Consultation', 'Adjustment Session', 'Physical Therapy', 'Follow-up'],
    formTemplates: ['pain-assessment', 'injury-history', 'lifestyle-questionnaire'],
    dashboardMetrics: ['Pain Reduction', 'Range of Motion', 'Treatment Progress', 'Patient Satisfaction'],
    workflowPriorities: ['Pain Assessment', 'Treatment Planning', 'Progress Tracking']
  },
  dental_sleep: {
    id: 'dental_sleep',
    name: 'Midwest Dental Sleep Medicine',
    brandName: 'Dental Sleep IQ',
    description: 'Specialized practice management for dental sleep medicine with comprehensive sleep disorder workflows',
    tagline: 'Comprehensive Sleep Disorder Solutions',
    primaryColor: '#1E40AF',
    secondaryColor: '#1D4ED8',
    accentColor: '#60A5FA',
    logoUrl: '/dental-sleep-logo.svg',
    iconUrl: '/sleep-icon.svg',
    heroImage: '/sleep-hero.jpg',
    specialtyFocus: 'Sleep Apnea & Airway Management',
    patientTypes: ['Sleep Apnea', 'Snoring', 'TMJ Disorders', 'Airway Obstruction'],
    commonProcedures: ['Sleep Study Analysis', 'Oral Appliance Fitting', 'CPAP Coordination', 'Airway Assessment'],
    billingCodes: [
      { code: 'E0486', description: 'Oral appliance for OSA', fee: 1850 },
      { code: 'D5999', description: 'Sleep appliance adjustment', fee: 125 },
      { code: 'D0160', description: 'Detailed oral exam', fee: 85 }
    ],
    appointmentTypes: ['Sleep Consultation', 'Appliance Fitting', 'Follow-up Adjustment', 'Progress Check'],
    formTemplates: ['sleep-questionnaire', 'epworth-scale', 'medical-history'],
    dashboardMetrics: ['AHI Reduction', 'Appliance Compliance', 'Sleep Quality', 'Patient Outcomes'],
    workflowPriorities: ['Sleep Assessment', 'Treatment Planning', 'Appliance Management']
  },
  med_spa: {
    id: 'med_spa',
    name: 'Elite Medical Spa',
    brandName: 'Med Spa IQ',
    description: 'Luxury medical spa management with comprehensive aesthetic treatment workflows',
    tagline: 'Luxury Aesthetic Medicine Platform',
    primaryColor: '#EC4899',
    secondaryColor: '#DB2777',
    accentColor: '#F472B6',
    logoUrl: '/medspa-logo.svg',
    iconUrl: '/aesthetic-icon.svg',
    heroImage: '/medspa-hero.jpg',
    specialtyFocus: 'Aesthetic & Anti-Aging Treatments',
    patientTypes: ['Anti-Aging', 'Skin Rejuvenation', 'Body Contouring', 'Wellness'],
    commonProcedures: ['Botox', 'Dermal Fillers', 'Laser Treatments', 'Chemical Peels', 'CoolSculpting'],
    billingCodes: [
      { code: '64612', description: 'Botox injection', fee: 12 },
      { code: '11950', description: 'Dermal filler injection', fee: 650 },
      { code: '17110', description: 'Laser skin treatment', fee: 300 }
    ],
    appointmentTypes: ['Consultation', 'Botox Treatment', 'Filler Session', 'Laser Treatment', 'Follow-up'],
    formTemplates: ['aesthetic-consultation', 'treatment-history', 'skincare-assessment'],
    dashboardMetrics: ['Treatment Satisfaction', 'Before/After Progress', 'Retention Rate', 'Revenue per Visit'],
    workflowPriorities: ['Consultation', 'Treatment Planning', 'Results Tracking']
  },
  concierge: {
    id: 'concierge',
    name: 'Premium Concierge Medicine',
    brandName: 'Concierge IQ',
    description: 'Executive healthcare management with personalized concierge medicine workflows',
    tagline: 'Personalized Healthcare Excellence',
    primaryColor: '#7C3AED',
    secondaryColor: '#6D28D9',
    accentColor: '#A78BFA',
    logoUrl: '/concierge-logo.svg',
    iconUrl: '/concierge-icon.svg',
    heroImage: '/concierge-hero.jpg',
    specialtyFocus: 'Executive Health & Wellness',
    patientTypes: ['Executive Health', 'Preventive Care', 'Chronic Disease Management', 'Wellness Optimization'],
    commonProcedures: ['Comprehensive Physical', 'Executive Health Panel', 'Wellness Consultation', 'Preventive Care'],
    billingCodes: [
      { code: '99213', description: 'Office visit, established', fee: 150 },
      { code: '99396', description: 'Preventive visit, adult', fee: 200 },
      { code: '99401', description: 'Preventive counseling', fee: 75 }
    ],
    appointmentTypes: ['Executive Physical', 'Wellness Consultation', 'Follow-up Care', 'Preventive Visit'],
    formTemplates: ['executive-health', 'lifestyle-assessment', 'risk-stratification'],
    dashboardMetrics: ['Health Score', 'Risk Factors', 'Wellness Goals', 'Preventive Metrics'],
    workflowPriorities: ['Health Assessment', 'Risk Management', 'Wellness Planning']
  },
  hrt: {
    id: 'hrt',
    name: 'Optimal Hormone Therapy',
    brandName: 'HRT IQ',
    description: 'Advanced hormone replacement therapy management with comprehensive optimization workflows',
    tagline: 'Precision Hormone Optimization',
    primaryColor: '#DC2626',
    secondaryColor: '#B91C1C',
    accentColor: '#F87171',
    logoUrl: '/hrt-logo.svg',
    iconUrl: '/hormone-icon.svg',
    heroImage: '/hrt-hero.jpg',
    specialtyFocus: 'Hormone Replacement & Optimization',
    patientTypes: ['Hormone Deficiency', 'Anti-Aging', 'Menopause', 'Low Testosterone', 'Thyroid Disorders'],
    commonProcedures: ['Hormone Testing', 'Pellet Insertion', 'Injection Therapy', 'Monitoring Labs'],
    billingCodes: [
      { code: '11980', description: 'Hormone pellet insertion', fee: 350 },
      { code: '96372', description: 'Injection therapy', fee: 25 },
      { code: '80327', description: 'Hormone panel', fee: 180 }
    ],
    appointmentTypes: ['Initial Consultation', 'Lab Review', 'Pellet Insertion', 'Injection Visit', 'Monitoring'],
    formTemplates: ['hormone-assessment', 'symptom-tracker', 'lifestyle-factors'],
    dashboardMetrics: ['Hormone Levels', 'Symptom Improvement', 'Energy Levels', 'Quality of Life'],
    workflowPriorities: ['Hormone Assessment', 'Treatment Planning', 'Monitoring']
  }
};

export const getSpecialtyConfig = (specialty: SpecialtyType): SpecialtyConfig => {
  return specialtyConfigs[specialty];
};

export const detectSpecialty = (): SpecialtyType => {
  if (typeof window === 'undefined') return 'chiropractic';
  
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  if (hostname.includes('chiro') || pathname.includes('chiro')) return 'chiropractic';
  if (hostname.includes('sleep') || pathname.includes('dental')) return 'dental_sleep';
  if (hostname.includes('spa') || pathname.includes('aesthetic')) return 'med_spa';
  if (hostname.includes('concierge') || pathname.includes('executive')) return 'concierge';
  if (hostname.includes('hormone') || pathname.includes('hrt')) return 'hrt';
  
  return 'chiropractic'; // Default
};
