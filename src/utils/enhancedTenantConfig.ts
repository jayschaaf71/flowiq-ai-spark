
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

export type EnhancedTenantType = 'chiropractic' | 'dental' | 'general' | string;

export interface EnhancedTenantConfig {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  subdomain?: string;
  brandName: string;
  tagline?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  specialty: string;
  subscriptionTier: string;
  customBrandingEnabled: boolean;
  apiAccessEnabled: boolean;
  whiteLabelEnabled: boolean;
  visitTypes: string[];
  formTemplates: string[];
}

// Enhanced tenant detection that uses auth context
export const useCurrentTenant = () => {
  const { primaryTenant } = useEnhancedAuth();
  
  return primaryTenant ? {
    id: primaryTenant.tenant_id,
    name: primaryTenant.tenant.name,
    brandName: primaryTenant.tenant.brand_name,
    specialty: primaryTenant.tenant.specialty,
  } : null;
};

// Get tenant-specific configuration
export const useTenantConfig = (tenantId?: string) => {
  const { userRoles, primaryTenant } = useEnhancedAuth();
  
  const targetTenantId = tenantId || primaryTenant?.tenant_id;
  const tenantRole = userRoles.find(role => role.tenant_id === targetTenantId);
  
  if (!tenantRole) {
    return getDefaultTenantConfig();
  }

  return {
    id: tenantRole.tenant.id,
    name: tenantRole.tenant.name,
    brandName: tenantRole.tenant.brand_name,
    specialty: tenantRole.tenant.specialty,
    // These would be fetched from tenant_settings table in a real implementation
    tagline: 'AI-Powered Practice Management',
    primaryColor: '#3B82F6',
    secondaryColor: '#06B6D4',
    logoUrl: '/flowiq-logo.svg',
    visitTypes: getVisitTypesForSpecialty(tenantRole.tenant.specialty),
    formTemplates: getFormTemplatesForSpecialty(tenantRole.tenant.specialty),
  };
};

// Default configuration fallback
const getDefaultTenantConfig = () => ({
  id: 'default',
  name: 'FlowIQ',
  brandName: 'FlowIQ',
  specialty: 'Healthcare',
  tagline: 'The AI Business Operating System',
  primaryColor: '#3B82F6',
  secondaryColor: '#06B6D4',
  logoUrl: '/flowiq-logo.svg',
  visitTypes: ['Consultation', 'Follow-up', 'Treatment'],
  formTemplates: ['general-intake', 'medical-history'],
});

// Get visit types based on specialty
const getVisitTypesForSpecialty = (specialty: string): string[] => {
  const visitTypeMap: Record<string, string[]> = {
    'Chiropractic Care': [
      'Initial Consultation',
      'Adjustment Session',
      'Spinal Decompression',
      'Physical Therapy',
      'Massage Therapy',
      'Follow-up Visit'
    ],
    'Dental Care': [
      'Regular Cleaning',
      'Consultation',
      'Filling',
      'Root Canal',
      'Crown Placement',
      'Teeth Whitening',
      'Oral Surgery'
    ],
    'Physical Therapy': [
      'Initial Evaluation',
      'Treatment Session',
      'Progress Check',
      'Discharge Planning'
    ],
    'Mental Health': [
      'Initial Assessment',
      'Therapy Session',
      'Group Therapy',
      'Medication Review'
    ]
  };

  return visitTypeMap[specialty] || [
    'Consultation',
    'Follow-up',
    'Treatment',
    'Assessment'
  ];
};

// Get form templates based on specialty
const getFormTemplatesForSpecialty = (specialty: string): string[] => {
  const templateMap: Record<string, string[]> = {
    'Chiropractic Care': [
      'chiro-intake',
      'pain-assessment',
      'medical-history',
      'insurance-verification'
    ],
    'Dental Care': [
      'dental-intake',
      'dental-history',
      'insurance-info',
      'treatment-consent'
    ],
    'Physical Therapy': [
      'pt-intake',
      'injury-assessment',
      'functional-capacity'
    ],
    'Mental Health': [
      'mental-health-intake',
      'psychological-assessment',
      'risk-assessment'
    ]
  };

  return templateMap[specialty] || [
    'general-intake',
    'medical-history'
  ];
};
