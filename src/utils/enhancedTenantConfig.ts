import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

export interface TenantConfig {
  id: string;
  name: string;
  brand_name: string;
  brandName: string; // Add alias for compatibility
  specialty: string;
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  tagline?: string;
}

// Default tenant configurations by specialty
const DEFAULT_TENANTS: Record<string, TenantConfig> = {
  chiropractic: {
    id: 'default-chiro',
    name: 'FlowIQ Demo',
    brand_name: 'FlowIQ',
    brandName: 'FlowIQ',
    specialty: 'chiropractic-care',
    primary_color: '#16a34a',
    secondary_color: '#22c55e',
    tagline: 'Chiropractic Care'
  },
  dental: {
    id: 'default-dental',
    name: 'Dental IQ',
    brand_name: 'Dental IQ',
    brandName: 'Dental IQ',
    specialty: 'dental-care',
    primary_color: '#3b82f6',
    secondary_color: '#60a5fa',
    tagline: 'The AI Business Operating System'
  },
  'dental-sleep': {
    id: 'default-dental-sleep',
    name: 'Dental Sleep IQ',
    brand_name: 'Dental Sleep IQ',
    brandName: 'Dental Sleep IQ',
    specialty: 'dental-sleep-medicine',
    primary_color: '#8b5cf6',
    secondary_color: '#a78bfa',
    tagline: 'Sleep Medicine Solutions'
  }
};

// Helper function to detect current specialty from URL or context
const detectCurrentSpecialty = (): string => {
  const path = window.location.pathname;
  const wrapper = document.querySelector('[class*="-iq-theme"]');
  
  if (wrapper?.classList.contains('dental-sleep-iq-theme') || path.includes('dental-sleep')) {
    return 'dental-sleep';
  } else if (wrapper?.classList.contains('dental-iq-theme') || path.includes('dental')) {
    return 'dental';
  } else {
    return 'chiropractic';
  }
};

export const useCurrentTenant = () => {
  const { user, profile } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        setLoading(true);
        
        console.log('fetchTenant called with user:', user?.id, 'profile:', profile);
        
        // Detect current specialty context
        const currentSpecialty = detectCurrentSpecialty();
        console.log('Detected specialty:', currentSpecialty);
        
        // If no user, use default tenant for detected specialty
        if (!user || !profile) {
          console.log('No user or profile, using default tenant for specialty:', currentSpecialty);
          const tenant = DEFAULT_TENANTS[currentSpecialty] || DEFAULT_TENANTS.chiropractic;
          setCurrentTenant(tenant);
          setLoading(false);
          return;
        }

        // Try to get tenant from user's profile
        const tenantId = profile.tenant_id;
        console.log('Profile tenant_id:', tenantId);
        
        if (!tenantId) {
          console.log('No tenant_id in profile, using default tenant for specialty:', currentSpecialty);
          const tenant = DEFAULT_TENANTS[currentSpecialty] || DEFAULT_TENANTS.chiropractic;
          setCurrentTenant(tenant);
          setLoading(false);
          return;
        }

        // Fetch tenant configuration from database
        const { data: tenant, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', tenantId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching tenant:', error, 'for tenantId:', tenantId);
          const currentSpecialty = detectCurrentSpecialty();
          const defaultTenant = DEFAULT_TENANTS[currentSpecialty] || DEFAULT_TENANTS.chiropractic;
          setCurrentTenant(defaultTenant);
        } else if (!tenant) {
          console.log('No tenant found for id:', tenantId);
          const currentSpecialty = detectCurrentSpecialty();
          const defaultTenant = DEFAULT_TENANTS[currentSpecialty] || DEFAULT_TENANTS.chiropractic;
          setCurrentTenant(defaultTenant);
        } else {
          console.log('Successfully fetched tenant:', tenant);
          setCurrentTenant({
            id: tenant.id,
            name: tenant.name,
            brand_name: tenant.brand_name,
            brandName: tenant.brand_name, // Add alias
            specialty: tenant.specialty,
            primary_color: tenant.primary_color,
            secondary_color: tenant.secondary_color,
            logo_url: tenant.logo_url,
            tagline: tenant.tagline
          });
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
        const currentSpecialty = detectCurrentSpecialty();
        const tenant = DEFAULT_TENANTS[currentSpecialty] || DEFAULT_TENANTS.chiropractic;
        setCurrentTenant(tenant);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [user, profile]);

  return { currentTenant, loading };
};

// Add useTenantConfig export that AppSidebar expects
export const useTenantConfig = () => {
  const { currentTenant } = useCurrentTenant();
  const currentSpecialty = detectCurrentSpecialty();
  return currentTenant || DEFAULT_TENANTS[currentSpecialty] || DEFAULT_TENANTS.chiropractic;
};

// Specialty mapping for consistent theming
export const getSpecialtyTheme = (specialty: string) => {
  const normalizedSpecialty = specialty?.toLowerCase().replace(/\s+/g, '-');
  
  switch (normalizedSpecialty) {
    case 'chiropractic-care':
    case 'chiropractic':
      return {
        primaryColor: '#16a34a',
        secondaryColor: '#22c55e',
        accentColor: '#dcfce7',
        theme: 'chiropractic'
      };
    case 'dental-care':
    case 'dental':
      return {
        primaryColor: '#3b82f6',
        secondaryColor: '#60a5fa',
        accentColor: '#dbeafe',
        theme: 'dental'
      };
    case 'dental-sleep-medicine':
    case 'dental-sleep':
      return {
        primaryColor: '#8b5cf6',
        secondaryColor: '#a78bfa',
        accentColor: '#ede9fe',
        theme: 'dental-sleep'
      };
    default:
      return {
        primaryColor: '#16a34a',
        secondaryColor: '#22c55e',
        accentColor: '#dcfce7',
        theme: 'default'
      };
  }
};