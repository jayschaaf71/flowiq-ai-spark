
export type TenantType = 'chiro' | 'dental' | 'default';

export interface TenantConfig {
  name: string;
  domain: string;
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  specialty: string;
  visitTypes: string[];
  formTemplates: string[];
}

const tenantConfigs: Record<TenantType, TenantConfig> = {
  chiro: {
    name: 'ChiroIQ',
    domain: 'chiro.flow-iq.ai',
    brandName: 'ChiroIQ',
    primaryColor: 'blue',
    secondaryColor: 'green',
    logo: '/chiro-logo.svg',
    specialty: 'Chiropractic Care',
    visitTypes: [
      'Initial Consultation',
      'Adjustment Session',
      'Spinal Decompression',
      'Physical Therapy',
      'Massage Therapy',
      'Follow-up Visit'
    ],
    formTemplates: [
      'chiro-intake',
      'pain-assessment',
      'medical-history',
      'insurance-verification'
    ]
  },
  dental: {
    name: 'DentalIQ',
    domain: 'dental.flow-iq.ai',
    brandName: 'DentalIQ',
    primaryColor: 'teal',
    secondaryColor: 'blue',
    logo: '/dental-logo.svg',
    specialty: 'Dental Care',
    visitTypes: [
      'Regular Cleaning',
      'Consultation',
      'Filling',
      'Root Canal',
      'Crown Placement',
      'Teeth Whitening',
      'Oral Surgery'
    ],
    formTemplates: [
      'dental-intake',
      'dental-history',
      'insurance-info',
      'treatment-consent'
    ]
  },
  default: {
    name: 'FlowIQ',
    domain: 'flow-iq.ai',
    brandName: 'FlowIQ',
    primaryColor: 'purple',
    secondaryColor: 'blue',
    logo: '/flowiq-logo.svg',
    specialty: 'Healthcare',
    visitTypes: [
      'Consultation',
      'Follow-up',
      'Treatment',
      'Assessment'
    ],
    formTemplates: [
      'general-intake',
      'medical-history'
    ]
  }
};

export const detectTenant = (): TenantType => {
  if (typeof window === 'undefined') return 'default';
  
  const hostname = window.location.hostname;
  
  if (hostname.includes('chiro')) return 'chiro';
  if (hostname.includes('dental')) return 'dental';
  
  return 'default';
};

export const getTenantConfig = (tenant?: TenantType): TenantConfig => {
  const currentTenant = tenant || detectTenant();
  return tenantConfigs[currentTenant] || tenantConfigs.default;
};

export const useTenantConfig = () => {
  const tenant = detectTenant();
  return getTenantConfig(tenant);
};
