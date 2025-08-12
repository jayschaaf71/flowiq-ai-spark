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

// Production tenant configurations for subdomains
const PRODUCTION_TENANTS: Record<string, TenantConfig> = {
  'midwest-dental-sleep': {
    id: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    name: 'Midwest Dental Sleep Medicine Institute',
    brand_name: 'Midwest Dental Sleep Medicine Institute',
    brandName: 'Midwest Dental Sleep Medicine Institute',
    specialty: 'dental-sleep-medicine',
    primary_color: '#8b5cf6',
    secondary_color: '#a78bfa',
    tagline: 'Advanced Sleep Medicine Solutions'
  },
  'west-county-spine': {
    id: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
    name: 'West County Spine and Joint',
    brand_name: 'West County Spine and Joint',
    brandName: 'West County Spine and Joint',
    specialty: 'chiropractic-care',
    primary_color: '#16a34a',
    secondary_color: '#22c55e',
    tagline: 'Expert Chiropractic Care for Optimal Spinal Health'
  },
  'connect': {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'FlowIQ Connect',
    brand_name: 'FlowIQ Connect',
    brandName: 'FlowIQ Connect',
    specialty: 'communication',
    primary_color: '#0ea5e9',
    secondary_color: '#38bdf8',
    tagline: 'Smart Business Communication & Scheduling'
  },
  'general-dentistry': {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Dental IQ',
    brand_name: 'Dental IQ',
    brandName: 'Dental IQ',
    specialty: 'general-dentistry',
    primary_color: '#0ea5e9',
    secondary_color: '#38bdf8',
    tagline: 'Comprehensive Dental Care Excellence'
  }
};

// Helper function to get subdomain from URL
const getCurrentSubdomain = () => {
  const hostname = window.location.hostname;

  // For localhost development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return null;
  }

  // For Lovable development (UUID hostnames) - check this FIRST
  if (hostname.includes('lovableproject.com')) {
    console.log('Skipping tenant lookup for Lovable development hostname:', hostname);
    return null; // Skip tenant lookup for development
  }

  // For production domains like tenant.domain.com
  if (hostname.includes('midwest-dental-sleep.flow-iq.ai')) {
    return 'midwest-dental-sleep';
  }

  if (hostname.includes('west-county-spine.flow-iq.ai')) {
    return 'west-county-spine';
  }

  if (hostname.includes('connect.flow-iq.ai')) {
    return 'connect';
  }

  const parts = hostname.split('.');

  // For production domains like tenant.domain.com
  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
};

export function useEnhancedTenantConfig() {
  const { user } = useAuth();
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTenantConfig = async () => {
    try {
      setIsLoading(true);

      const subdomain = getCurrentSubdomain();
      const currentPath = window.location.pathname;
      console.log('🚀 [DIAGNOSTIC] Loading tenant config for subdomain:', subdomain, 'user:', user?.id, 'path:', currentPath);

      // DIAGNOSTIC MODE: Route-based tenant detection (takes priority over profile)
      const getRouteBasedTenant = (): TenantConfig | null => {
        console.log('🔍 [DIAGNOSTIC] Checking route-based tenant detection for path:', currentPath);

        if (currentPath.includes('/chiropractic') || currentPath.includes('chiropractic-care')) {
          console.log('✅ [DIAGNOSTIC] Route detected CHIROPRACTIC - forcing chiropractic tenant');
          return PRODUCTION_TENANTS['west-county-spine'] || DEFAULT_TENANTS.chiropractic;
        }

        if (currentPath.includes('/dental-sleep')) {
          console.log('✅ [DIAGNOSTIC] Route detected DENTAL-SLEEP - forcing dental-sleep tenant');
          return PRODUCTION_TENANTS['midwest-dental-sleep'] || DEFAULT_TENANTS['dental-sleep'];
        }

        if (currentPath.includes('/dental')) {
          console.log('✅ [DIAGNOSTIC] Route detected DENTAL - forcing dental tenant');
          return DEFAULT_TENANTS.dental;
        }

        console.log('❌ [DIAGNOSTIC] No specific route detected, proceeding with normal logic');
        return null;
      };

      // Priority 0: Route-based detection (NEW - highest priority)
      const routeBasedTenant = getRouteBasedTenant();
      if (routeBasedTenant) {
        console.log('🎯 [DIAGNOSTIC] Using route-based tenant:', routeBasedTenant);
        setTenantConfig(routeBasedTenant);
        return;
      }

      // Priority 1: Check for subdomain-based tenant (works for both authenticated and anonymous users)
      if (subdomain) {
        console.log('Fetching tenant by subdomain:', subdomain);

        // First check if it's a known production tenant
        if (PRODUCTION_TENANTS[subdomain]) {
          console.log('Found production tenant config for subdomain:', subdomain);
          setTenantConfig(PRODUCTION_TENANTS[subdomain]);
          return;
        }

        // Fallback to database lookup
        const { data: tenant, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('subdomain', subdomain)
          .single();

        if (error) {
          console.error('Error fetching tenant by subdomain:', error);
        } else if (tenant) {
          console.log('Found tenant:', tenant);
          const settings = tenant.settings as any;
          const config: TenantConfig = {
            id: tenant.id,
            name: tenant.name,
            brand_name: tenant.business_name || tenant.name,
            brandName: tenant.business_name || tenant.name,
            specialty: tenant.specialty,
            primary_color: tenant.primary_color || DEFAULT_TENANTS.general.primary_color,
            secondary_color: tenant.secondary_color || DEFAULT_TENANTS.general.secondary_color,
            logo_url: tenant.logo_url,
            tagline: settings?.branding?.tagline || getTenantConfigForSpecialty(tenant.specialty).tagline
          };

          setTenantConfig(config);
          return;
        }
      }

      // Priority 2: For authenticated users without subdomain, use their current tenant
      if (user) {
        console.log('🔍 [DIAGNOSTIC] Fetching user tenant for authenticated user');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('current_tenant_id')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('❌ [DIAGNOSTIC] Error fetching profile:', profileError);
        } else if (profile?.current_tenant_id) {
          console.log('👤 [DIAGNOSTIC] User profile current_tenant_id:', profile.current_tenant_id);
          console.log('🔍 [DIAGNOSTIC] Current path:', currentPath);
          console.log('⚠️ [DIAGNOSTIC] WARNING: Using profile tenant but route might override this');

          const { data: tenant, error: tenantError } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', profile.current_tenant_id)
            .single();

          if (tenantError) {
            console.error('❌ [DIAGNOSTIC] Error fetching tenant:', tenantError);
          } else if (tenant) {
            console.log('🏢 [DIAGNOSTIC] Found tenant from profile:', {
              id: tenant.id,
              name: tenant.name,
              specialty: tenant.specialty,
              conflictsWith: currentPath.includes('/chiropractic') && tenant.specialty !== 'chiropractic-care'
            });

            const settings = tenant.settings as any;
            const config: TenantConfig = {
              id: tenant.id,
              name: tenant.name,
              brand_name: tenant.business_name || tenant.name,
              brandName: tenant.business_name || tenant.name,
              specialty: tenant.specialty,
              primary_color: tenant.primary_color || DEFAULT_TENANTS.general.primary_color,
              secondary_color: tenant.secondary_color || DEFAULT_TENANTS.general.secondary_color,
              logo_url: tenant.logo_url,
              tagline: settings?.branding?.tagline || getTenantConfigForSpecialty(tenant.specialty).tagline
            };

            console.log('✅ [DIAGNOSTIC] Loaded tenant config from database:', config);
            setTenantConfig(config);
            return;
          }
        } else {
          console.log('⚠️ [DIAGNOSTIC] User has no current_tenant_id in profile');
        }
      }

      // Priority 3: For non-authenticated users without subdomain, check URL path for demo/preview mode
      if (!user) {
        const path = window.location.pathname;
        let defaultConfig = DEFAULT_TENANTS.chiropractic;

        if (path.includes('/chiropractic')) {
          defaultConfig = DEFAULT_TENANTS.chiropractic;
        } else if (path.includes('/dental-sleep') || path.includes('dental-sleep')) {
          defaultConfig = DEFAULT_TENANTS['dental-sleep'];
        } else if (path.includes('/dental')) {
          defaultConfig = DEFAULT_TENANTS.dental;
        } else if (path.includes('/med-spa') || path.includes('/medspa')) {
          defaultConfig = DEFAULT_TENANTS['med-spa'];
        }

        setTenantConfig(defaultConfig);
        return;
      }

      // Priority 4: Final fallback to default
      console.log('Using default tenant config');
      setTenantConfig(DEFAULT_TENANTS.chiropractic);
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