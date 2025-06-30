
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

export interface TenantConfig {
  id: string;
  name: string;
  brand_name: string;
  specialty: string;
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  tagline?: string;
}

// Default tenant configuration for fallback
const DEFAULT_TENANT: TenantConfig = {
  id: 'default',
  name: 'FlowIQ Demo',
  brand_name: 'FlowIQ',
  specialty: 'chiropractic-care',
  primary_color: '#16a34a',
  secondary_color: '#22c55e',
  tagline: 'The AI Business Operating System'
};

export const useCurrentTenant = () => {
  const { user, profile } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        // If no user, use default tenant
        if (!user || !profile) {
          setCurrentTenant(DEFAULT_TENANT);
          setLoading(false);
          return;
        }

        // Try to get tenant from user's profile
        const tenantId = profile.tenant_id;
        if (!tenantId) {
          setCurrentTenant(DEFAULT_TENANT);
          setLoading(false);
          return;
        }

        // Fetch tenant configuration from database
        const { data: tenant, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', tenantId)
          .single();

        if (error || !tenant) {
          console.log('Using default tenant configuration');
          setCurrentTenant(DEFAULT_TENANT);
        } else {
          setCurrentTenant({
            id: tenant.id,
            name: tenant.name,
            brand_name: tenant.brand_name,
            specialty: tenant.specialty,
            primary_color: tenant.primary_color,
            secondary_color: tenant.secondary_color,
            logo_url: tenant.logo_url,
            tagline: tenant.tagline
          });
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
        setCurrentTenant(DEFAULT_TENANT);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [user, profile]);

  return { currentTenant, loading };
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
