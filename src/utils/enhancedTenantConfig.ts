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
    name: 'FlowIQ Dental',
    brand_name: 'FlowIQ Dental',
    brandName: 'FlowIQ Dental',
    specialty: 'dental-care',
    primary_color: '#0ea5e9',
    secondary_color: '#38bdf8',
    tagline: 'Dental Care Excellence'
  },
  'dental-sleep': {
    id: 'default-dental-sleep',
    name: 'FlowIQ Sleep',
    brand_name: 'FlowIQ Sleep',
    brandName: 'FlowIQ Sleep',
    specialty: 'dental-sleep-medicine',
    primary_color: '#8b5cf6',
    secondary_color: '#a78bfa',
    tagline: 'Sleep Medicine'
  },
  'med-spa': {
    id: 'default-medspa',
    name: 'FlowIQ MedSpa',
    brand_name: 'FlowIQ MedSpa',
    brandName: 'FlowIQ MedSpa',
    specialty: 'medical-spa',
    primary_color: '#ec4899',
    secondary_color: '#f472b6',
    tagline: 'Medical Spa Services'
  },
  general: {
    id: 'default-general',
    name: 'FlowIQ',
    brand_name: 'FlowIQ',
    brandName: 'FlowIQ',
    specialty: 'chiropractic-practice',
    primary_color: '#06b6d4',
    secondary_color: '#22d3ee',
    tagline: 'Chiropractic Practice'
  }
};

export function useEnhancedTenantConfig() {
  const { user } = useAuth();
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTenantConfig = async () => {
    try {
      setIsLoading(true);
      console.log('Mock loading tenant config for user:', user?.id);
      
      // HIPAA COMPLIANCE: Use user-specific specialty storage
      const userSpecificKey = user?.id ? `currentSpecialty_${user.id}` : null;
      const currentSpecialty = (userSpecificKey ? localStorage.getItem(userSpecificKey) : null) || 
                               'chiropractic';
      
      console.log('Loading config for specialty:', currentSpecialty);
      const config = DEFAULT_TENANTS[currentSpecialty] || DEFAULT_TENANTS.chiropractic;
      
      setTenantConfig(config);
    } catch (error) {
      console.error('Error loading tenant config:', error);
      setTenantConfig(DEFAULT_TENANTS.chiropractic);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTenantConfig = async (updates: Partial<TenantConfig>) => {
    try {
      console.log('Mock updating tenant config:', updates);
      
      if (tenantConfig) {
        const updatedConfig = { ...tenantConfig, ...updates };
        setTenantConfig(updatedConfig);
        return updatedConfig;
      }
      return null;
    } catch (error) {
      console.error('Error updating tenant config:', error);
      return null;
    }
  };

  useEffect(() => {
    loadTenantConfig();
  }, [user]);

  // Listen for specialty changes from localStorage - optimized to prevent excessive reloads
  useEffect(() => {
    const handleStorageChange = () => {
      // HIPAA COMPLIANCE: Only listen to user-specific specialty changes
      const userSpecificKey = user?.id ? `currentSpecialty_${user.id}` : null;
      const currentSpecialty = userSpecificKey ? localStorage.getItem(userSpecificKey) : null;
      if (currentSpecialty && tenantConfig?.specialty !== currentSpecialty) {
        loadTenantConfig();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [tenantConfig?.specialty]);

  return {
    tenantConfig,
    currentTenant: tenantConfig, // Add alias for compatibility
    isLoading,
    loading: isLoading, // Add alias for compatibility
    tagline: tenantConfig?.tagline,
    updateTenantConfig,
    refetch: loadTenantConfig
  };
}

export const getTenantConfigForSpecialty = (specialty: string): TenantConfig => {
  return DEFAULT_TENANTS[specialty] || DEFAULT_TENANTS.general;
};

export const enhancedTenantConfigService = {
  async getTenantConfig(tenantId?: string): Promise<TenantConfig | null> {
    console.log('Mock fetching tenant config for:', tenantId);
    return DEFAULT_TENANTS.general;
  },
  
  async updateTenantConfig(tenantId: string, updates: Partial<TenantConfig>): Promise<TenantConfig | null> {
    console.log('Mock updating tenant config:', tenantId, updates);
    return { ...DEFAULT_TENANTS.general, ...updates };
  }
};

// Add missing exports for compatibility
export const useTenantConfig = useEnhancedTenantConfig;
export const useCurrentTenant = useEnhancedTenantConfig;

export const getSpecialtyTheme = (specialty: string) => {
  const config = DEFAULT_TENANTS[specialty] || DEFAULT_TENANTS.general;
  return {
    primaryColor: config.primary_color,
    secondaryColor: config.secondary_color,
    accentColor: config.secondary_color, // Add for compatibility
    theme: 'modern', // Add for compatibility
    name: config.name,
    tagline: config.tagline
  };
};